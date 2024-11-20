from flask import Flask, jsonify, Response, request
import wlkatapython
import serial
import time
from ph4_walkingpad import pad
from ph4_walkingpad.pad import WalkingPad, Controller
from ph4_walkingpad.utils import setup_logging
import asyncio
import yaml
import cv2
import signal
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# ---- CONFIGURACIÓN PARA EL BRAZO ROBÓTICO ----

serial_port = None
mirobot = None
camera = cv2.VideoCapture(0)  # Inicializar la cámara

# Evento de parada de emergencia
emergency_stop_event = asyncio.Event()

def iniciar_conexion():
    global serial_port, mirobot
    try:
        # Configura el puerto serial y el objeto mirobot
        serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
        mirobot = wlkatapython.Wlkata_UART()
        mirobot.init(serial_port, -1)
        print("Conexión establecida con el brazo robótico.")
    except Exception as e:
        print("Error al conectar:", str(e))

# Llamar a iniciar_conexion al inicio del script
iniciar_conexion()

def cerrar_conexion():
    global serial_port, camera
    if serial_port:
        serial_port.close()
        print("Conexión cerrada con el brazo robótico.")
    if camera.isOpened():
        camera.release()
        print("Cámara liberada.")

minimal_cmd_space = 0.69
log = setup_logging()
pad.logger = log
ctler = Controller()

async def connect():
    address = load_config()['address']
    print("Connecting to {0}".format(address))
    await ctler.run(address)
    await asyncio.sleep(minimal_cmd_space)

async def disconnect():
    await ctler.disconnect()
    await asyncio.sleep(minimal_cmd_space)

def load_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

async def run_walking_pad():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)
        await asyncio.sleep(0.5)
        await ctler.start_belt()
        await asyncio.sleep(0.5)
        await ctler.change_speed(5)

        for _ in range(52):  # 5.2 segundos dividido en intervalos de 0.1s
            if emergency_stop_event.is_set():
                break
            await asyncio.sleep(0.1)

        await ctler.switch_mode(WalkingPad.MODE_STANDBY)
        await asyncio.sleep(0.5)

    except Exception as e:
        print(f"Error en caminadora: {str(e)}")
    finally:
        await disconnect()  # Asegurar desconexión al finalizar

# Función asincrónica para el movimiento del brazo robótico en la posición "Defective"
async def run_robot_arm_defective():
    try:
        mirobot.writeangle(0, 0, 0, 53, 0, -50, 0)
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): return
        mirobot.pump(1)
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): return
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): return
        mirobot.writeangle(0, 90, 0, 35, 0, -50, 0)
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): return
        mirobot.pump(0)
        await asyncio.sleep(2)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    except Exception as e:
        print(f"Error en brazo robótico: {str(e)}")

# Función asincrónica para el movimiento del brazo robótico en la posición "Good"
async def run_robot_arm_good():
    try:
        print("Iniciando el primer movimiento del brazo robótico...")
        mirobot.writeangle(0, 0, 0, 53, 0, -50, 0)  # Primer movimiento
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): 
            print("Paro de emergencia activado, deteniendo el movimiento")
            return
        
        print("Activando el agarre...")
        mirobot.pump(1)  # Activar agarre
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): 
            print("Paro de emergencia activado, deteniendo el movimiento")
            return
        
        print("Ejecutando el segundo movimiento...")
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)  # Segundo movimiento
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): 
            print("Paro de emergencia activado, deteniendo el movimiento")
            return
        
        print("Ejecutando el tercer movimiento hacia la posición 'Good' (opuesta a 'Defective')...")
        mirobot.writeangle(0, -90, 35, 0, 0, 0, 0)  # Ajusta aquí según la posición opuesta deseada
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): 
            print("Paro de emergencia activado, deteniendo el movimiento")
            return
        
        print("Desactivando el agarre...")
        mirobot.pump(0)  # Desactivar agarre
        await asyncio.sleep(2)
        
        print("Regresando a la posición inicial...")
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)  # Posición inicial
        print("Movimiento completo.")
    except Exception as e:
        print(f"Error en brazo robótico: {str(e)}")

# Endpoint para iniciar la caminadora y luego el brazo robótico en la posición "Defective" secuencialmente
@app.route("/startwalk_defective", methods=['POST'])
async def startwalk_defective():
    emergency_stop_event.clear()
    await run_walking_pad()
    await run_robot_arm_defective()
    return jsonify({"status": "Caminadora y brazo robótico en posición 'Defective' ejecutados secuencialmente"}), 200

# Endpoint para iniciar la caminadora y luego el brazo robótico en la posición "Good" secuencialmente
@app.route("/startwalk_good", methods=['POST'])
async def startwalk_good():
    emergency_stop_event.clear()
    await run_walking_pad()
    await run_robot_arm_good()
    return jsonify({"status": "Caminadora y brazo robótico en posición 'Good' ejecutados secuencialmente"}), 200

# Endpoint para el paro de emergencia
@app.route("/emergency_stop", methods=['POST'])
async def emergency_stop():
    emergency_stop_event.set()
    await ctler.switch_mode(WalkingPad.MODE_STANDBY)
    mirobot.cancellation()
    mirobot.pump(0)
    return jsonify({"status": "Paro de emergencia activado: caminadora y brazo detenidos"}), 200

# Async function to move the robotic arm to specified angles
@app.route("/move_arm", methods=['POST'])
async def move_arm():
    data = request.get_json()
    angles = {
        "J1": data.get("J1", 0),
        "J2": data.get("J2", 0),
        "J3": data.get("J3", 0),
        "J4": data.get("J4", 0),
        "J5": data.get("J5", 0),
        "J6": data.get("J6", 0)
    }

    try:
        # Send each joint movement command without returning to the initial position
        if emergency_stop_event.is_set():
            print("Paro de emergencia activado. Deteniendo el movimiento.")
            return jsonify({"status": "Movimiento interrumpido por paro de emergencia"}), 500

        # Command the robotic arm to move to the specified angles
        mirobot.writeangle(0, angles["J1"], angles["J2"], angles["J3"], angles["J4"], angles["J5"], angles["J6"])

        # Optional: Add a short sleep if necessary to allow the movement to complete
        await asyncio.sleep(0.5)

        return jsonify({"status": "Movimiento completado"}), 200

    except Exception as e:
        print(f"Error en el movimiento del brazo robótico: {str(e)}")
        return jsonify({"status": "Error en el movimiento del brazo robótico", "error": str(e)}), 500


# Generador de frames para el video
def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Ruta para el video en tiempo real
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Función para cerrar recursos al recibir señales de salida
def cerrar_recursos(signal, frame):
    print("Liberando recursos y cerrando conexiones...")
    cerrar_conexion()  # Cerrar conexiones de hardware y cámara
    emergency_stop_event.set()  # Asegurar que el evento de emergencia se cierre
    exit(0)

# Asociar las señales SIGINT y SIGTERM para asegurar cierre limpio
signal.signal(signal.SIGINT, cerrar_recursos)
signal.signal(signal.SIGTERM, cerrar_recursos)

# Ejecutar el servidor
if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    finally:
        cerrar_conexion()  # Cerrar la conexión del brazo al finalizar

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
import os
import subprocess
import numpy as np


app = Flask(__name__)
CORS(app)

# ---- CONFIGURACIÓN PARA EL BRAZO ROBÓTICO ----

serial_port = None
mirobot = None
camera1 = cv2.VideoCapture(2)  # Inicializar la cámara
camera2 = cv2.VideoCapture(0)  # Inicializar la cámara

# Evento de parada de emergencia
emergency_stop_event = asyncio.Event()

# ---- CONFIGURACIÓN DEL WALKINGPAD ----

minimal_cmd_space = 0.69
log = setup_logging()
pad.logger = log
ctler = Controller()

# Dirección Bluetooth del WalkingPad 1422CE35-1129-9D4B-D12E-FB5E1FD718AA
WALKINGPAD_ADDRESS = "57:4C:4E:31:0E:C2"

# Último estado registrado del WalkingPad
last_status = {
    "steps": None,
    "distance": None,
    "time": None
}

# ---- FUNCIONES DE CONEXIÓN ----

def iniciar_conexion():
    global serial_port, mirobot
    try:
        # Configura el puerto serial y el objeto mirobot
        serial_port = serial.Serial('COM3', 115200, timeout=1)
        mirobot = wlkatapython.Wlkata_UART()
        mirobot.init(serial_port, -1)
        print("Conexión establecida con el brazo robótico.")
    except Exception as e:
        print("Error al conectar:", str(e))

# Llamar a iniciar_conexion al inicio del script
iniciar_conexion()

def cerrar_conexion():
    global serial_port, camera1, camera2
    if serial_port:
        serial_port.close()
        print("Conexión cerrada con el brazo robótico.")
    if camera1.isOpened():
        camera1.release()
        print("Cámara liberada.")
    if camera2.isOpened():
        camera2.release()
        print("Cámara liberada.")

def restart_bluetooth():
    os.system("sudo systemctl restart bluetooth")
    print("Servicio Bluetooth reiniciado.")

def check_bluetooth_status():
    result = subprocess.run(["hcitool", "dev"], stdout=subprocess.PIPE, text=True)
    if "hci0" in result.stdout:
        print("El adaptador Bluetooth está activo.")
        return True
    else:
        print("El adaptador Bluetooth no está disponible.")
        return False

async def connect_walkingpad():
    global ctler
    try:
        ctler = Controller()  # Crear un nuevo controlador en cada conexión
        print(f"Connecting to {WALKINGPAD_ADDRESS}")
        await ctler.run(WALKINGPAD_ADDRESS)
        await asyncio.sleep(minimal_cmd_space)
    except Exception as e:
        print(f"Error al conectar con el WalkingPad: {str(e)}")
        if not check_bluetooth_status():
            restart_bluetooth()

async def disconnect_walkingpad():
    global ctler
    try:
        if ctler is not None:
            # Verifica el estado antes de desconectar
            await ctler.switch_mode(WalkingPad.MODE_STANDBY)
            await asyncio.sleep(1)  # Espera antes de desconectar
            await ctler.disconnect()
            print("Conexión con el WalkingPad cerrada.")
        else:
            print("El controlador ya está desconectado o no inicializado.")
    except Exception as e:
        print(f"Error al desconectar el WalkingPad: {str(e)}")
    finally:
        ctler = None  # Libera el controlador
        await asyncio.sleep(minimal_cmd_space)


async def run_walking_pad():
    try:
        await connect_walkingpad()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)
        await asyncio.sleep(0.5)
        await ctler.start_belt()
        await asyncio.sleep(0.5)
        await ctler.change_speed(5)

        for _ in range(52):
            if emergency_stop_event.is_set():
                break
            await asyncio.sleep(0.1)

        await ctler.switch_mode(WalkingPad.MODE_STANDBY)
        await asyncio.sleep(0.5)

    except Exception as e:
        print(f"Error en caminadora: {str(e)}")
    finally:
        await disconnect_walkingpad()
        await asyncio.sleep(5)  # Aumenta el tiempo para liberar el Bluetooth


# ---- FUNCIONES DEL BRAZO ROBÓTICO ----

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

async def run_robot_arm_good():
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
        mirobot.writeangle(0, -90, 35, 0, 0, 0, 0)
        await asyncio.sleep(2)
        if emergency_stop_event.is_set(): return
        mirobot.pump(0)
        await asyncio.sleep(2)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
    except Exception as e:
        print(f"Error en brazo robótico: {str(e)}")

        #---------------- funciones de clasificacion-----------------------

# Integración de tu lógica de clasificación
def preprocess_image(image):
    blurred = cv2.GaussianBlur(image, (5, 5), 0)
    equalized = cv2.equalizeHist(blurred)
    _, binary = cv2.threshold(equalized, 240, 255, cv2.THRESH_BINARY)
    return binary

def detect_red_marks(image):
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_red1 = np.array([0, 100, 100])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([160, 100, 100])
    upper_red2 = np.array([179, 255, 255])
    mask1 = cv2.inRange(hsv_image, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv_image, lower_red2, upper_red2)
    red_mask = cv2.bitwise_or(mask1, mask2)
    return red_mask

def classify_circuit(image, red_mask):
    if cv2.countNonZero(red_mask) > 0:
        return "Bad"
    elif cv2.countNonZero(image) > 100:  # Threshold para detectar circuitos
        return "Good"
    return "No Circuit"

# ---- ENDPOINTS ----

# Bandera global para controlar la ejecución continua
continuous_classification = False

@app.route("/start_continuous_classification", methods=["POST", "GET"])
async def start_continuous_classification():
    global continuous_classification
    continuous_classification = True  # Activa la ejecución continua
    print("Inicio de clasificación continua.")

    while continuous_classification:
        # Captura una imagen de la cámara
        success, frame = camera1.read()
        if not success:
            print("Error al capturar imagen.")
            await asyncio.sleep(2)  # Espera antes de intentar de nuevo
            continue

        # Detecta si hay un circuito azul (trabaja directamente con la imagen BGR)
        blue_mask = preprocess_image(frame)
        circuit_present = detect_circuit(blue_mask)

        if circuit_present:
            print("Circuito detectado. Esperando 3 segundos para clasificar...")
            await asyncio.sleep(3)

            # Detecta marcas rojas y clasifica el circuito (trabaja con la imagen BGR)
            red_mask = detect_red_marks(frame)
            binary_image = preprocess_image(frame)  # Usa frame directamente (BGR)
            result = classify_circuit(binary_image, red_mask)

            # Actúa basado en la clasificación
            if result == "Good":
                print("Circuito clasificado como Good. Ejecutando /startwalk_good...")
                await startwalk_good()
            elif result == "Bad":
                print("Circuito clasificado como Bad. Ejecutando /startwalk_defective...")
                await startwalk_defective()
            else:
                print("No se detectó ningún circuito válido.")
        else:
            print("No se detectó ningún circuito. Esperando 2 segundos antes de intentar de nuevo...")
        
        # Espera 2 segundos antes de volver a intentar detectar un circuito
        await asyncio.sleep(2)

    return jsonify({"status": "Clasificación continua detenida."}), 200


@app.route("/stop_continuous_classification", methods=["POST", "GET"])
def stop_continuous_classification():
    global continuous_classification
    continuous_classification = False  # Desactiva la ejecución continua
    print("Clasificación continua detenida.")
    return jsonify({"status": "Clasificación continua detenida."}), 200


# --- Funciones de detección ---
def preprocess_image(image):
    """
    Preprocess the image to detect the presence of blue color.
    :param image: Input BGR image.
    :return: Binary mask highlighting blue regions.
    """
    # Convert the image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define HSV range for blue color
    lower_blue = np.array([100, 50, 50])  # Lower bound for blue
    upper_blue = np.array([140, 255, 255])  # Upper bound for blue

    # Threshold the image to get only blue colors
    blue_mask = cv2.inRange(hsv_image, lower_blue, upper_blue)

    return blue_mask


def detect_circuit(blue_mask):
    """
    Detect if a circuit is present in the image based on blue regions.
    :param blue_mask: Binary mask of blue regions.
    :return: True if a circuit is detected, False otherwise.
    """
    # Find contours in the blue mask
    contours, _ = cv2.findContours(blue_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        # Compute contour properties
        area = cv2.contourArea(contour)
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = max(w / h, h / w)

        # Criteria for detecting a circuit
        if (
            area > 2000  # Minimum area for a circuit
            and aspect_ratio < 2.0  # Not overly elongated
        ):
            return True

    return False
    return jsonify({"status": "Clasificación continua detenida."}), 200

@app.route("/startwalk_defective", methods=['POST'])
async def startwalk_defective():
    emergency_stop_event.clear()
    await run_walking_pad()
    await run_robot_arm_defective()
    return jsonify({"status": "Caminadora y brazo robótico en posición 'Defective' ejecutados secuencialmente"}), 200

@app.route("/startwalk_good", methods=['POST'])
async def startwalk_good():
    emergency_stop_event.clear()
    await run_walking_pad()
    await run_robot_arm_good()
    return jsonify({"status": "Caminadora y brazo robótico en posición 'Good' ejecutados secuencialmente"}), 200

@app.route("/emergency_stop", methods=['POST'])
async def emergency_stop():
    emergency_stop_event.set()
    await disconnect_walkingpad()
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
        success, frame = camera1.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
def generate_frames2():
    while True:
        success, frame = camera2.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed2')
def video_feed2():
    return Response(generate_frames2(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# ---- MANEJO DE SEÑALES Y EJECUCIÓN ----

def cerrar_recursos(signal, frame):
    print("Liberando recursos y cerrando conexiones...")
    emergency_stop_event.set()
    asyncio.run(disconnect_walkingpad())  # Asegura la desconexión
    cerrar_conexion()
    exit(0)


signal.signal(signal.SIGINT, cerrar_recursos)
signal.signal(signal.SIGTERM, cerrar_recursos)

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=8067)
    finally:
        cerrar_conexion()

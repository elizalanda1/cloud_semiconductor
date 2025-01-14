from flask import Flask, jsonify, Response, request
import wlkatapython
import serial
import time
from ph4_walkingpad import pad
from ph4_walkingpad.pad import WalkingPad, Controller
from ph4_walkingpad.utils import setup_logging
import asyncio
import cv2
import signal
from flask_cors import CORS
import os
import subprocess
import numpy as np
#import hid
import traceback
import sys
import io
import ast


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---- CONFIGURACIÓN PARA EL BRAZO ROBÓTICO ----

serial_port = None
mirobot = None
camera1 = cv2.VideoCapture(2)  # Inicializar la cámara
camera2 = cv2.VideoCapture(1)  # Inicializar la cámara

# Evento de parada de emergencia
emergency_stop_event = asyncio.Event()

# ---- CONFIGURACIÓN DEL WALKINGPAD ----

minimal_cmd_space = 0.69
log = setup_logging()
pad.logger = log
ctler = Controller()

# Dirección Bluetooth del WalkingPad 1422CE35-1129-9D4B-D12E-FB5E1FD718AA 57:4C:4E:31:0E:C2
WALKINGPAD_ADDRESS = "1422CE35-1129-9D4B-D12E-FB5E1FD718AA"

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
        # Configura el puerto serial y el objeto mirobot /dev/tty.usbserial-1420
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

    pump_status = data.get("pump", 0)  # 1 for activate, 0 for deactivate
    run_walkingpad = data.get("run_walkingpad", False)  # True to activate, False to ignore

    try:
        # Check for emergency stop
        if emergency_stop_event.is_set():
            print("Paro de emergencia activado. Deteniendo el movimiento.")
            return jsonify({"status": "Movimiento interrumpido por paro de emergencia"}), 500

        # Command the robotic arm to move to the specified angles
        mirobot.writeangle(0, angles["J1"], angles["J2"], angles["J3"], angles["J4"], angles["J5"], angles["J6"])
        await asyncio.sleep(0.5)

        # Control the pump based on the pump_status value
        if pump_status == 1:
            mirobot.pump(1)  # Activate pump
            print("Pump activado.")
        elif pump_status == 0:
            mirobot.pump(0)  # Deactivate pump
            print("Pump desactivado.")

        # Run the walking pad if specified
        if run_walkingpad:
            print("Iniciando caminadora...")
            walking_pad_task = asyncio.create_task(run_walking_pad())  # Run asynchronously
            await walking_pad_task
            print("Caminadora ejecutada y completada.")

        return jsonify({
            "status": "Movimiento completado, pump actualizado" + (" y caminadora ejecutada" if run_walkingpad else "")
        }), 200

    except Exception as e:
        print(f"Error en el movimiento del brazo robótico o caminadora: {str(e)}")
        return jsonify({"status": "Error en el sistema", "error": str(e)}), 500


# Async function to move the robotic arm to specified angles
@app.route("/move_arm_previous", methods=['POST'])
async def move_arm_previous():
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
    
# Inicialización global del dispositivo HID
device = None

def iniciar_device_hid():
    global device
    try:
        device = hid.device()
        device.open(0x1DD8, 0x000F)  # Reemplaza con Vendor ID y Product ID
        device.set_nonblocking(True)
        print("Gamepad conectado correctamente.")
    except Exception as e:
        print(f"No se pudo conectar al gamepad: {e}")

iniciar_device_hid()

def cerrar_device_hid():
    global device
    if device is not None:
        device.close()
        print("Gamepad desconectado.")

angles = {
    "J1": 0,
    "J2": 0,
    "J3": 0,
    "J4": 0,
    "J5": 0,
    "J6": 0
}
current_joint = 1  # Empezar con Joint 1 seleccionado
prev_joystick_left = {"x": 128, "y": 128}
prev_joystick_right = {"x": 128, "y": 128}
prev_buttons = {"byte1": 0, "byte2": 0}


# Bandera global para controlar el estado de /move_arm2
move_arm_active = False

@app.route("/move_arm2", methods=["POST"])
async def move_arm2():
    global current_joint, angles, device, prev_buttons, mirobot, move_arm_active

    try:
        move_arm_active = True  # Activa el bucle
        while move_arm_active:
            # Leer datos del gamepad
            data = device.read(64)
            if not data:
                await asyncio.sleep(0.1)
                continue

            # Leer botones del gamepad
            buttons_byte_1 = data[4]
            buttons_byte_2 = data[5]

            # Detectar cambios en los botones
            if buttons_byte_1 != prev_buttons["byte1"] or buttons_byte_2 != prev_buttons["byte2"]:
                # **Mapeo exacto de botones**
                if buttons_byte_1 == 0b1:  # Botón 5
                    if mirobot is not None:
                        print("Enviando a Home.")
                        mirobot.homing()
                    else:
                        print("El brazo robótico no está conectado.")
                elif buttons_byte_2 == 0b100:  # Botón 7
                    current_joint = max(1, current_joint - 1)
                    print(f"Joint seleccionado: {current_joint}")
                elif buttons_byte_2 == 0b1000:  # Botón 8
                    current_joint = min(6, current_joint + 1)
                    print(f"Joint seleccionado: {current_joint}")
                elif buttons_byte_1 == 0b10001111:  # Botón 4
                    angles[f"J{current_joint}"] = min(180, angles[f"J{current_joint}"] + 5)
                    print(f"Incrementando Joint {current_joint}: {angles[f'J{current_joint}']}")
                elif buttons_byte_1 == 0b101111:  # Botón 2
                    angles[f"J{current_joint}"] = max(-180, angles[f"J{current_joint}"] - 5)
                    print(f"Decrementando Joint {current_joint}: {angles[f'J{current_joint}']}")
                elif buttons_byte_1 == 0b11111:  # Botón 1
                    if mirobot is not None:
                        print("Activando pump.")
                        mirobot.pump(1)
                    else:
                        print("El brazo robótico no está conectado.")
                elif buttons_byte_1 == 0b1001111:  # Botón 3
                    if mirobot is not None:
                        print("Desactivando pump.")
                        mirobot.pump(0)
                    else:
                        print("El brazo robótico no está conectado.")

            # Actualizar el estado previo de los botones
            prev_buttons["byte1"] = buttons_byte_1
            prev_buttons["byte2"] = buttons_byte_2

            # Ejecutar el movimiento con los ángulos actualizados si es necesario
            if mirobot is not None:
                mirobot.writeangle(
                    0,
                    angles["J1"],
                    angles["J2"],
                    angles["J3"],
                    angles["J4"],
                    angles["J5"],
                    angles["J6"],
                )

            await asyncio.sleep(0.1)  # Breve espera para evitar saturar el loop

    except Exception as e:
        print(f"Error en el movimiento del brazo robótico: {e}")
        return jsonify({"status": "Error en el movimiento del brazo robótico", "error": str(e)}), 500

    return jsonify({"status": "El endpoint /move_arm2 ha sido detenido correctamente."}), 200


@app.route("/stop_move_arm2", methods=["POST"])
def stop_move_arm2():
    global move_arm_active
    move_arm_active = False  # Detiene el bucle del endpoint
    print("El endpoint /move_arm2 ha sido detenido.")
    return jsonify({"status": "El endpoint /move_arm2 ha sido detenido."}), 200

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

@app.route('/execute_arm_script', methods=['POST'])
def execute_arm_script():
    data = request.get_json()
    script = data.get('script', '')

    if not script:
        return jsonify({'status': 'error', 'message': 'No se proporcionó ningún script.'}), 400

    safe_globals = {
        "__builtins__": {
            'print': print,
            'range': range,
            'len': len,
        },
        "mirobot": mirobot,  # Asegúrate de que mirobot esté definido en este contexto.
        "time": time,
        "traceback": traceback,
        "io": io,
        "sys": sys,
    }

    old_stdout = sys.stdout
    redirected_output = io.StringIO()
    sys.stdout = redirected_output

    try:
        exec(script, safe_globals)
        sys.stdout = old_stdout
        output = redirected_output.getvalue()
        return jsonify({'status': 'success', 'output': output}), 200
    except Exception as e:
        sys.stdout = old_stdout
        error_message = traceback.format_exc()
        return jsonify({'status': 'error', 'message': error_message}), 500

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

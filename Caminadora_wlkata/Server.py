from flask import Flask, request, jsonify
import wlkatapython
import serial
import time
from ph4_walkingpad import pad
from ph4_walkingpad.pad import WalkingPad, Controller
from ph4_walkingpad.utils import setup_logging
import asyncio
import yaml

app = Flask(__name__)

# ---- CONFIGURACIÓN PARA EL BRAZO ROBÓTICO ----

serial_port = None
mirobot = None

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
    global serial_port
    if serial_port:
        serial_port.close()
        print("Conexión cerrada.")

@app.route("/homing", methods=['POST'])
def homing():
    try:
        mirobot.homing()
        time.sleep(2)
        return jsonify({"status": "Homing completado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/mover", methods=['POST'])
def mover():
    datos = request.get_json()
    try:
        x = datos.get("x", 0)
        y = datos.get("y", 0)
        z = datos.get("z", 0)
        mirobot.writecoordinate(x, y, z, 0, 0, 0, 0, 0)
        time.sleep(2)
        return jsonify({"status": f"Movimiento completado a ({x}, {y}, {z})"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predefined_moves", methods=['POST'])
def predefined_moves():
    movimientos = [
        {"x": 100, "y": 0, "z": 200, "rx": 0, "ry": 0, "rz": 0},
        {"x": 150, "y": 50, "z": 150, "rx": 0, "ry": 0, "rz": 0},
        {"x": 200, "y": 100, "z": 100, "rx": 0, "ry": 0, "rz": 0},
        {"x": 250, "y": 50, "z": 150, "rx": 0, "ry": 0, "rz": 0},
        {"x": 300, "y": 0, "z": 200, "rx": 0, "ry": 0, "rz": 0}
    ]
    resultados = []
    try:
        for i, movimiento in enumerate(movimientos):
            x = movimiento["x"]
            y = movimiento["y"]
            z = movimiento["z"]
            rx = movimiento["rx"]
            ry = movimiento["ry"]
            rz = movimiento["rz"]
            mirobot.writecoordinate(x, y, z, rx, ry, rz, 0, 0)
            time.sleep(2)
            resultados.append({
                "movimiento": i + 1,
                "status": f"Movimiento completado a ({x}, {y}, {z}, {rx}, {ry}, {rz})"
            })
        return jsonify({"status": "Serie de movimientos completada", "resultados": resultados}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/activate_grip", methods=['POST'])
def activate_grip():
    try:
        mirobot.pump(1)
        time.sleep(2)
        mirobot.pump(0)
        return jsonify({"status": "Grip activated for 2 seconds, then deactivated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/move_defective", methods=['POST'])
def move_to_defective():
    try:
        mirobot.writeangle(0, 0, 0, 50, 0, -50, 0)
        time.sleep(2)
        mirobot.pump(1)
        time.sleep(2)
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
        time.sleep(2)
        mirobot.writeangle(0, 90, 0, 35, 0, -50, 0)
        time.sleep(2)
        mirobot.pump(0)
        time.sleep(2)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
        time.sleep(2)
        return jsonify({"status": "Movimiento hacia posición 'Defective' completado con agarre"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/move_good", methods=['POST'])
def move_to_good():
    try:
        mirobot.writeangle(0, 0, 0, 50, 0, -50, 0)
        time.sleep(2)
        mirobot.pump(1)
        time.sleep(2)
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
        time.sleep(2)
        mirobot.writeangle(0, -90, 0, 35, 0, -50, 0)
        time.sleep(2)
        mirobot.pump(0)
        time.sleep(2)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
        time.sleep(2)
        return jsonify({"status": "Movimiento hacia posición 'Good' completado con agarre"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- CONFIGURACIÓN PARA LA CAMINADORA ----

minimal_cmd_space = 0.69
log = setup_logging()
pad.logger = log
ctler = Controller()

def load_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

async def connect():
    address = load_config()['address']
    print("Connecting to {0}".format(address))
    await ctler.run(address)
    await asyncio.sleep(minimal_cmd_space)

async def disconnect():
    await ctler.disconnect()
    await asyncio.sleep(minimal_cmd_space)


@app.route("/startwalk", methods=['POST'])
async def walk2():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)  # Cambiar al modo manual
        await asyncio.sleep(0.5)

        # Enviar comando de arranque de banda
        await ctler.start_belt()
        await asyncio.sleep(0.5)

        # Bajar velocidad
        await ctler.change_speed(5)
        await asyncio.sleep(0.5)

        # Esperar 2 segundos antes de detener la caminadora
        await asyncio.sleep(5.2)
        await ctler.switch_mode(WalkingPad.MODE_STANDBY)  # Detener la caminadora
        await asyncio.sleep(minimal_cmd_space)
    finally:
        await disconnect()

    return last_status

@app.route("/finishwalk", methods=['POST'])
async def finish_walk():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_STANDBY)
        await asyncio.sleep(minimal_cmd_space)
    finally:
        await disconnect()
    return "Caminadora detenida", 200

@app.route("/emergency_stop", methods=['POST'])
async def emergency_stop():
    try:
        # Conectar a la caminadora y detenerla en modo de espera
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_STANDBY)  # Pone la caminadora en modo de espera
        await asyncio.sleep(minimal_cmd_space)

        # Detener cualquier movimiento en curso del brazo robótico
        mirobot.cancellation()  # Ejecuta el comando de cancelación para detener el brazo robótico
        mirobot.pump(0)  # Desactiva el agarre si está activo

        return jsonify({"status": "Paro de emergencia activado: caminadora y brazo detenidos"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        await disconnect()

@app.route("/speed", methods=['POST'])
async def speed():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)
        await asyncio.sleep(0.5)
        await ctler.change_speed(5)
        await asyncio.sleep(0.5)
    finally:
        await disconnect()
    return "Velocidad cambiada", 200

@app.route("/current_mode", methods=['GET'])
async def get_current_mode():
    try:
        await connect()
        await ctler.ask_stats()
        await asyncio.sleep(minimal_cmd_space)
        mode = ctler.last_status.manual_mode
        if mode == WalkingPad.MODE_STANDBY:
            return {"current_mode": "standby"}
        elif mode == WalkingPad.MODE_MANUAL:
            return {"current_mode": "manual"}
        elif mode == WalkingPad.MODE_AUTOMAT:
            return {"current_mode": "auto"}
        else:
            return {"current_mode": "unknown"}, 400
    finally:
        await disconnect()

@app.route("/startwalk_defective", methods=['POST'])
async def startwalk_defective():
    try:
        # Conectar a la caminadora, ejecutar todas las instrucciones y desconectar
        await connect()
        try:
            # Cambiar al modo manual, iniciar la banda y ajustar velocidad en una secuencia
            await ctler.switch_mode(WalkingPad.MODE_MANUAL)
            await asyncio.sleep(0.5)
            await ctler.start_belt()
            await asyncio.sleep(0.5)
            await ctler.change_speed(5)
            await asyncio.sleep(5.2)  # Mantener caminadora en movimiento por 5.2 segundos
            await ctler.switch_mode(WalkingPad.MODE_STANDBY)  # Detener la caminadora
            await asyncio.sleep(minimal_cmd_space)
        finally:
            await disconnect()  # Asegurar desconexión de la caminadora

        # Instrucciones para el brazo robótico
        try:
            # Secuencia de movimiento hacia la posición "defective"
            mirobot.writeangle(0, 0, 0, 50, 0, -50, 0)
            time.sleep(2)
            mirobot.pump(1)  # Activar el agarre
            time.sleep(2)
            mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
            time.sleep(2)
            mirobot.writeangle(0, 90, 0, 35, 0, -50, 0)
            time.sleep(2)
            mirobot.pump(0)  # Desactivar el agarre
            time.sleep(2)
            mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
            time.sleep(2)
            return jsonify({"status": "Movimiento hacia posición 'Defective' completado con agarre"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": f"Error en la conexión o movimiento de la caminadora: {str(e)}"}), 500

    return jsonify({"status": "Caminadora y brazo robótico ejecutados correctamente"}), 200



# Ejecutar el servidor
if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    finally:
        cerrar_conexion()

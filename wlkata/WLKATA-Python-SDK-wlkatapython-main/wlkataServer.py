from flask import Flask, request, jsonify
import wlkatapython
import serial
import time

# Inicializar el servidor Flask
app = Flask(__name__)

# Configuración de conexión serial
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

# Cierra la conexión al final
def cerrar_conexion():
    global serial_port
    if serial_port:
        serial_port.close()
        print("Conexión cerrada.")

# Llamar a iniciar_conexion al inicio del script
iniciar_conexion()

# Ruta para homing
@app.route("/homing", methods=['POST'])
def homing():
    try:
        mirobot.homing()
        time.sleep(2)
        return jsonify({"status": "Homing completado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para enviar coordenadas
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

            # Enviar movimiento al brazo
            mirobot.writecoordinate(x, y, z, rx, ry, rz, 0, 0)
            time.sleep(2)  # Pausa entre movimientos para asegurar ejecución

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
        # Activate the pump for 2 seconds
        mirobot.pump(1)
        time.sleep(2)
        
        # Deactivate the pump
        mirobot.pump(0)

        return jsonify({"status": "Grip activated for 2 seconds, then deactivated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para obtener el estado del brazo
@app.route("/estado", methods=['GET'])
def estado():
    try:
        estado_actual = mirobot.getStatus()
        return jsonify(estado_actual), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para detener el brazo
@app.route("/detener", methods=['POST'])
def detener():
    try:
        mirobot.stop()
        return jsonify({"status": "Brazo detenido"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
from time import sleep

@app.route("/move_defective", methods=['POST'])
def move_to_defective():
    try:
        # Posición de Agarre
        mirobot.writeangle(0, 0, 0, 50, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Activar el grip (usar la función de la bomba)
        mirobot.pump(1)
        sleep(2)  # Espera para asegurar que el agarre esté activado

        # Posición de Altura_agarre
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Posición de Defective
        mirobot.writeangle(0, 90, 0, 35, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Desactivar el grip (soltar)
        mirobot.pump(0)
        sleep(2)  # Espera para asegurar que el agarre esté desactivado

        # Posición de Main (posición final)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
        sleep(2)  # Espera de 2 segundos en la posición final

        return jsonify({"status": "Movimiento hacia posición 'Defective' completado con agarre"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from time import sleep

@app.route("/move_good", methods=['POST'])
def move_to_good():
    try:
        # Posición de Agarre
        mirobot.writeangle(0, 0, 0, 50, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Activar el grip
        mirobot.pump(1)
        sleep(2)  # Espera para asegurar que el agarre esté activado

        # Posición de Altura_agarre
        mirobot.writeangle(0, 0, 0, 35, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Posición de Good
        mirobot.writeangle(0, -90, 0, 35, 0, -50, 0)
        sleep(2)  # Espera de 2 segundos en la posición

        # Desactivar el grip (soltar)
        mirobot.pump(0)
        sleep(2)  # Espera para asegurar que el agarre esté desactivado

        # Posición de Main (posición final)
        mirobot.writeangle(0, 0, 0, 0, 0, 0, 0)
        sleep(2)  # Espera de 2 segundos en la posición final

        return jsonify({"status": "Movimiento hacia posición 'Good' completado con agarre"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ejecutar el servidor
if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    finally:
        cerrar_conexion()

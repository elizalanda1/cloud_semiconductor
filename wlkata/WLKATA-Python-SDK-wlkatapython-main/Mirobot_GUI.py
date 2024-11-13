import wlkatapython
import serial
import threading
from flask import Flask, request, jsonify

# Configuración del servidor Flask
app = Flask(__name__)

# Configuración del puerto serial
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)

# Función para mantener la GUI del Mirobot activa en un hilo
def iniciar_gui():
    gui = wlkatapython.Mirobot_GUI()
    gui.Mirobot_GUI()

# Rutas para el servidor
@app.route('/homing', methods=['POST'])
def homing():
    mirobot.homing()
    return jsonify({"status": "Homing iniciado"})

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    # Asegúrate de recibir parámetros 'x', 'y', 'z', 'a', 'b', 'c' en el JSON
    x, y, z = data.get('x'), data.get('y'), data.get('z')
    a, b, c = data.get('a', 0), data.get('b', 0), data.get('c', 0)
    mirobot.writecoordinate(1, 1, x, y, z, a, b, c)  # movimiento relativo
    return jsonify({"status": "Movimiento relativo ejecutado", "x": x, "y": y, "z": z})

@app.route('/status', methods=['GET'])
def status():
    estado = mirobot.getStatus()
    return jsonify(estado)

# Iniciar GUI en un hilo separado
threading.Thread(target=iniciar_gui).start()

# Iniciar servidor Flask
if __name__ == '__main__':
    app.run(port=5000, debug=True)

from flask import Flask, Response, jsonify
import cv2

app = Flask(__name__)

# Inicializar la cámara (usa 0 para la cámara predeterminada del sistema)
camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        # Leer el frame de la cámara
        success, frame = camera.read()
        if not success:
            break
        else:
            # Codificar el frame como JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Usar el yield para crear un flujo de datos
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Ruta para el video en tiempo real
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Ruta de prueba
@app.route('/')
def index():
    return jsonify({"status": "Servidor de video en Flask activo"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

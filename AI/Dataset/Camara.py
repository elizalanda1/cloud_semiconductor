import cv2
import os

# Directorio para guardar las imágenes capturadas
output_directory = "dataset_images"
os.makedirs(output_directory, exist_ok=True)

# Iniciar la cámara web
cap = cv2.VideoCapture(0)

# Configuración de la cámara para mejor calidad
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)   # Resolución máxima
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
cap.set(cv2.CAP_PROP_BRIGHTNESS, 150)     # Ajusta valores de 0 a 255
cap.set(cv2.CAP_PROP_CONTRAST, 50)        # Ajusta valores de 0 a 255
cap.set(cv2.CAP_PROP_SATURATION, 50)      # Ajusta valores de 0 a 255
cap.set(cv2.CAP_PROP_AUTOFOCUS, 1)        # Habilita el autoenfoque si está soportado

if not cap.isOpened():
    print("Error al abrir la cámara.")
    exit()

print("Presiona 'c' para capturar una imagen o 'q' para salir.")

image_count = 0

while True:
    # Leer el cuadro actual de la cámara
    ret, frame = cap.read()
    if not ret:
        print("Error al capturar el cuadro.")
        break

    # Mostrar el cuadro en una ventana
    cv2.imshow("Captura de imágenes", frame)

    # Capturar la tecla presionada
    key = cv2.waitKey(1) & 0xFF

    # Si se presiona 'c', capturar y guardar la imagen
    if key == ord('c'):
        image_path = os.path.join(output_directory, f"imagen_{image_count}.jpg")
        cv2.imwrite(image_path, frame)
        print(f"Imagen guardada en: {image_path}")
        image_count += 1

    # Si se presiona 'q', salir del bucle
    elif key == ord('q'):
        break

# Liberar la cámara y cerrar la ventana
cap.release()
cv2.destroyAllWindows()

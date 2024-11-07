import cv2
import numpy as np
import os

# Directorio para guardar las imágenes capturadas
output_directory = "dataset_images"
os.makedirs(output_directory, exist_ok=True)

# Iniciar la cámara web
cap = cv2.VideoCapture(0)

# Configuración de la cámara
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

if not cap.isOpened():
    print("Error al abrir la cámara.")
    exit()

print("Presiona 'c' para capturar una imagen centrada en el color azul o 'q' para salir.")

image_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error al capturar el cuadro.")
        break

    # Convertir la imagen al espacio de color HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Definir el rango de color azul en HSV
    lower_blue = np.array([100, 150, 50])
    upper_blue = np.array([140, 255, 255])

    # Crear una máscara para el color azul
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    
    # Encontrar contornos en la máscara
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        # Encontrar el contorno más grande y centrarlo
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        centered_frame = frame[y:y + h, x:x + w]

        # Mostrar el cuadro centrado
        cv2.imshow("Captura de imágenes centrada en azul", centered_frame)
    else:
        # Mostrar la imagen original si no hay contornos
        cv2.imshow("Captura de imágenes", frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('c') and contours:
        image_path = os.path.join(output_directory, f"imagen_{image_count}.jpg")
        cv2.imwrite(image_path, centered_frame)
        print(f"Imagen guardada en: {image_path}")
        image_count += 1
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

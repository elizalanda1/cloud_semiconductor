import cv2
import os

# Crear la carpeta "Fotos" si no existe
if not os.path.exists("Fotos"):
    os.makedirs("Fotos")

# Abre la cámara
cap = cv2.VideoCapture(0)

# Verifica si la cámara está abierta
if not cap.isOpened():
    print("No se pudo abrir la cámara")
    exit()

print("Presiona 's' para capturar una imagen o 'q' para salir.")

while True:
    # Lee un frame de la cámara
    ret, frame = cap.read()
    
    if not ret:
        print("No se pudo recibir el frame (streaming terminado).")
        break

    # Muestra el video en tiempo real
    cv2.imshow('Video en tiempo real', frame)

    # Espera por una tecla presionada
    key = cv2.waitKey(1) & 0xFF

    # Si se presiona la tecla 's', guarda la imagen en la carpeta "Fotos"
    if key == ord('s'):
        nombre_archivo = input("Ingresa el nombre para la imagen (sin extensión): ") + ".jpg"
        ruta_archivo = os.path.join("Fotos", nombre_archivo)
        cv2.imwrite(ruta_archivo, frame)
        print(f"Imagen guardada como {ruta_archivo}")

    # Si se presiona la tecla 'q', sale del loop
    elif key == ord('q'):
        print("Cerrando la cámara.")
        break

# Libera la cámara y cierra las ventanas
cap.release()
cv2.destroyAllWindows()

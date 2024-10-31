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

print("Presiona 's' para capturar una imagen, recortar la región del circuito y guardarla, o 'q' para salir.")

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

    # Si se presiona la tecla 's', procesa y guarda la imagen
    if key == ord('s'):
        # Convertir la imagen a espacio de color HSV para detectar el color azul del circuito
        hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Definir el rango de color para detectar el azul (ajustar estos valores si es necesario)
        lower_blue = (100, 100, 50)
        upper_blue = (140, 255, 255)
        
        # Crear una máscara para el color azul
        mask = cv2.inRange(hsv_frame, lower_blue, upper_blue)
        
        # Encontrar los contornos en la máscara
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Si se detectan contornos, encontrar el más grande (se asume que es el circuito)
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            
            # Obtener el rectángulo delimitador del contorno más grande
            x, y, w, h = cv2.boundingRect(largest_contour)
            
            # Recortar la imagen alrededor del contorno del circuito
            cropped_img = frame[y:y+h, x:x+w]
            
            # Pedir el nombre para guardar la imagen recortada
            nombre_archivo = input("Ingresa el nombre para la imagen recortada (sin extensión): ") + ".jpg"
            ruta_archivo = os.path.join("Fotos", nombre_archivo)
            cv2.imwrite(ruta_archivo, cropped_img)
            print(f"Imagen recortada guardada como {ruta_archivo}")
        else:
            print("No se detectó el circuito. Asegúrate de que el circuito esté bien visible y en el área de visión de la cámara.")

    # Si se presiona la tecla 'q', sale del loop
    elif key == ord('q'):
        print("Cerrando la cámara.")
        break

# Libera la cámara y cierra las ventanas
cap.release()
cv2.destroyAllWindows()

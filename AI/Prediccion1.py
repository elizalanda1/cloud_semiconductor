import cv2
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Cargar el modelo entrenado y optimizado
mejor_modelo = joblib.load('mejor_modelo_rf.pkl')  # Asegúrate de haber guardado el modelo previamente con joblib.dump()

# Función para extraer características de una imagen
def extraer_caracteristicas_en_vivo(img):
    # Convertir a escala de grises
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Encontrar contornos
    contours, _ = cv2.findContours(gray_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Calcular características
    num_contornos = len(contours)
    area_total = sum(cv2.contourArea(contour) for contour in contours)
    perimetro_promedio = sum(cv2.arcLength(contour, True) for contour in contours) / num_contornos if num_contornos > 0 else 0
    densidad_contornos = area_total / num_contornos if num_contornos > 0 else 0

    # Crear un array con las características
    caracteristicas = np.array([[num_contornos, area_total, perimetro_promedio, densidad_contornos]])
    return caracteristicas

# Inicializar la cámara
cap = cv2.VideoCapture(0)
print("Presiona 'p' para hacer una predicción o 'q' para salir.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("No se pudo capturar la imagen.")
        break

    # Mostrar el video en vivo
    cv2.imshow("Video en vivo", frame)

    # Esperar a que el usuario presione una tecla
    key = cv2.waitKey(1) & 0xFF
    if key == ord('p'):
        # Extraer características y predecir
        caracteristicas = extraer_caracteristicas_en_vivo(frame)
        prediccion = mejor_modelo.predict(caracteristicas)
        print(f"Predicción: {prediccion[0]}")  # Muestra 'bueno' o 'defectuoso' según el modelo

    elif key == ord('q'):
        print("Cerrando cámara.")
        break

# Liberar la cámara y cerrar ventanas
cap.release()
cv2.destroyAllWindows()

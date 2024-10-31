import cv2
import os
import pandas as pd

# Definir las rutas de las carpetas de imágenes aumentadas
ruta_buenos = os.path.join(os.getcwd(), "imagenes_aumentadas_buenos")
ruta_defectuosos = os.path.join(os.getcwd(), "imagenes_aumentadas_defectuosos")

# Lista para almacenar características
caracteristicas = []

# Función para extraer características y asignar etiquetas
def extraer_caracteristicas(nombre_archivo, etiqueta):
    # Cargar la imagen en escala de grises
    img = cv2.imread(nombre_archivo, cv2.IMREAD_GRAYSCALE)

    # Encontrar contornos en la imagen
    contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Extraer características
    num_contornos = len(contours)
    area_total = sum(cv2.contourArea(contour) for contour in contours)
    perimetro_promedio = sum(cv2.arcLength(contour, True) for contour in contours) / num_contornos if num_contornos > 0 else 0
    densidad_contornos = area_total / num_contornos if num_contornos > 0 else 0

    # Guardar las características y la etiqueta en un diccionario
    return {
        "archivo": os.path.basename(nombre_archivo),
        "num_contornos": num_contornos,
        "area_total": area_total,
        "perimetro_promedio": perimetro_promedio,
        "densidad_contornos": densidad_contornos,
        "etiqueta": etiqueta
    }

# Procesar imágenes de circuitos buenos
for archivo in os.listdir(ruta_buenos):
    ruta_imagen = os.path.join(ruta_buenos, archivo)
    if ruta_imagen.endswith(".jpg") or ruta_imagen.endswith(".png"):
        caracteristicas_imagen = extraer_caracteristicas(ruta_imagen, "bueno")
        caracteristicas.append(caracteristicas_imagen)

# Procesar imágenes de circuitos defectuosos
for archivo in os.listdir(ruta_defectuosos):
    ruta_imagen = os.path.join(ruta_defectuosos, archivo)
    if ruta_imagen.endswith(".jpg") or ruta_imagen.endswith(".png"):
        caracteristicas_imagen = extraer_caracteristicas(ruta_imagen, "defectuoso")
        caracteristicas.append(caracteristicas_imagen)

# Convertir las características a un DataFrame y guardar en un CSV
df_caracteristicas = pd.DataFrame(caracteristicas)
df_caracteristicas.to_csv("caracteristicas_circuitos_aumentadas.csv", index=False)

print("Características extraídas y guardadas en 'caracteristicas_circuitos_aumentadas.csv'.")

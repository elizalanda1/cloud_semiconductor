import cv2
import os
import pandas as pd

# Definir la ruta de la carpeta con las imágenes procesadas
ruta_procesadas = os.path.join(os.getcwd(), "imagenes_procesadas")

# Crear una lista para almacenar las características de cada imagen
caracteristicas = []

# Función para extraer características de una imagen procesada y asignar la etiqueta
def extraer_caracteristicas(nombre_archivo):
    # Cargar la imagen en escala de grises
    img = cv2.imread(nombre_archivo, cv2.IMREAD_GRAYSCALE)

    # Encontrar contornos en la imagen
    contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Características a extraer
    num_contornos = len(contours)
    area_total = sum(cv2.contourArea(contour) for contour in contours)
    perimetro_promedio = sum(cv2.arcLength(contour, True) for contour in contours) / num_contornos if num_contornos > 0 else 0

    # Determinar la etiqueta según el nombre de archivo
    if "b" in os.path.basename(nombre_archivo):  # Archivos buenos
        etiqueta = "bueno"
    elif "m" in os.path.basename(nombre_archivo):  # Archivos defectuosos
        etiqueta = "defectuoso"
    else:
        etiqueta = "desconocido"  # Por si hubiera algún otro archivo

    # Guardar las características en un diccionario
    return {
        "archivo": os.path.basename(nombre_archivo),
        "num_contornos": num_contornos,
        "area_total": area_total,
        "perimetro_promedio": perimetro_promedio,
        "etiqueta": etiqueta
    }

# Procesar cada imagen en la carpeta de imágenes procesadas
for archivo in os.listdir(ruta_procesadas):
    ruta_imagen = os.path.join(ruta_procesadas, archivo)
    if ruta_imagen.endswith(".jpg") or ruta_imagen.endswith(".png"):
        caracteristicas_imagen = extraer_caracteristicas(ruta_imagen)
        caracteristicas.append(caracteristicas_imagen)

# Convertir las características a un DataFrame para análisis o entrenamiento
df_caracteristicas = pd.DataFrame(caracteristicas)

# Guardar el DataFrame en un archivo CSV para referencia futura
df_caracteristicas.to_csv("caracteristicas_circuitos.csv", index=False)

print("Características extraídas y guardadas en 'caracteristicas_circuitos.csv'.")
print(df_caracteristicas)

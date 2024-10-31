import cv2
import os
import numpy as np

# Crear carpetas para guardar las imágenes aumentadas si no existen
if not os.path.exists("imagenes_aumentadas_buenos"):
    os.makedirs("imagenes_aumentadas_buenos")
if not os.path.exists("imagenes_aumentadas_defectuosos"):
    os.makedirs("imagenes_aumentadas_defectuosos")

# Función para aumentar los datos de una imagen
def aumentar_datos(img, nombre_base, carpeta_destino, cantidad=10):
    for i in range(cantidad):
        # Rotación aleatoria
        angle = np.random.randint(-15, 15)
        M = cv2.getRotationMatrix2D((img.shape[1] // 2, img.shape[0] // 2), angle, 1)
        img_rotada = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]))

        # Ajuste de brillo y contraste aleatorio
        alpha = 1 + (np.random.rand() * 0.4 - 0.2)  # Contraste entre 0.8 y 1.2
        beta = np.random.randint(-10, 10)           # Brillo entre -10 y 10
        img_ajustada = cv2.convertScaleAbs(img_rotada, alpha=alpha, beta=beta)

        # Guardar la imagen aumentada
        nombre_archivo = f"{nombre_base}_aug_{i}.jpg"
        cv2.imwrite(os.path.join(carpeta_destino, nombre_archivo), img_ajustada)

# Rutas de las imágenes originales
ruta_buenos = "Fotos/buenos"
ruta_defectuosos = "Fotos/defectuosos"

# Generar aumentos para imágenes buenas
for archivo in os.listdir(ruta_buenos):
    if archivo.endswith(".jpg") or archivo.endswith(".png"):
        img = cv2.imread(os.path.join(ruta_buenos, archivo))
        aumentar_datos(img, archivo.split(".")[0], "imagenes_aumentadas_buenos", cantidad=10)

# Generar aumentos para imágenes defectuosas
for archivo in os.listdir(ruta_defectuosos):
    if archivo.endswith(".jpg") or archivo.endswith(".png"):
        img = cv2.imread(os.path.join(ruta_defectuosos, archivo))
        aumentar_datos(img, archivo.split(".")[0], "imagenes_aumentadas_defectuosos", cantidad=10)

print("Aumento de datos completado.")

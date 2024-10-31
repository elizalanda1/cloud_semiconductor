import cv2
import os

# Definir la ruta de la carpeta "Fotos" y la carpeta de salida "imagenes_procesadas"
ruta_fotos = os.path.join(os.getcwd(), "Fotos")
ruta_procesadas = os.path.join(os.getcwd(), "imagenes_procesadas")

# Crear la carpeta "imagenes_procesadas" si no existe
if not os.path.exists(ruta_procesadas):
    os.makedirs(ruta_procesadas)

# Función para capturar, procesar y guardar la imagen
def capturar_y_procesar(nombre_archivo):
    # Cargar la imagen original del circuito
    img = cv2.imread(nombre_archivo)
    
    # Convertir a escala de grises
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Aplicar un filtro Gaussiano para reducir el ruido
    blurred_img = cv2.GaussianBlur(gray_img, (5, 5), 0)

    # Detección de bordes usando el detector de Canny
    edges = cv2.Canny(blurred_img, 100, 200)

    # Guardar la imagen procesada en la carpeta "imagenes_procesadas"
    nombre_procesado = os.path.join(ruta_procesadas, f"procesado_{os.path.basename(nombre_archivo)}")
    cv2.imwrite(nombre_procesado, edges)
    print(f"Imagen procesada guardada como {nombre_procesado}")

# Lista de archivos de circuitos buenos y defectuosos en la carpeta "Fotos"
nombres_imagenes_buenos = [f"b{i}.jpg" for i in range(1, 11)]  # Imágenes buenas (b1.jpg, b2.jpg, ..., b10.jpg)
nombres_imagenes_defectuosos = [f"m{i}.jpg" for i in range(1, 11)]  # Imágenes defectuosas (d1.jpg, d2.jpg, ..., d10.jpg)

# Procesar y guardar cada imagen buena
for nombre in nombres_imagenes_buenos:
    ruta_imagen = os.path.join(ruta_fotos, nombre)
    capturar_y_procesar(ruta_imagen)

# Procesar y guardar cada imagen defectuosa
for nombre in nombres_imagenes_defectuosos:
    ruta_imagen = os.path.join(ruta_fotos, nombre)
    capturar_y_procesar(ruta_imagen)

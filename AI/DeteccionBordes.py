import cv2
import matplotlib.pyplot as plt

# Función para procesar la imagen y detectar bordes
def detectar_bordes(nombre_archivo):
    # Cargar la imagen recortada del circuito
    img = cv2.imread(nombre_archivo)

    # Convertir a escala de grises
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Aplicar un filtro Gaussiano para reducir el ruido
    blurred_img = cv2.GaussianBlur(gray_img, (5, 5), 0)

    # Detección de bordes usando el detector de Canny
    edges = cv2.Canny(blurred_img, 100, 200)

    # Visualizar la imagen original y los bordes
    fig, axs = plt.subplots(1, 2, figsize=(10, 5))
    axs[0].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    axs[0].set_title('Imagen Original')
    axs[0].axis('off')

    axs[1].imshow(edges, cmap='gray')
    axs[1].set_title('Bordes Detectados')
    axs[1].axis('off')

    plt.show()

# Ruta de las imágenes capturadas
imagenes = ['./Fotos/Fc1.jpg', './Fotos/Fc2.jpg']  # Cambia esto por las rutas correctas

# Aplicar la detección de bordes en cada imagen
for img in imagenes:
    detectar_bordes(img)

import cv2
import matplotlib.pyplot as plt

# Cargar la imagen
img = cv2.imread('ruta/de/tu/imagen.jpg', cv2.IMREAD_COLOR)

# 1. Convertir a escala de grises
gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 2. Aplicar un filtro Gaussiano para reducir el ruido
blurred_img = cv2.GaussianBlur(gray_img, (5, 5), 0)

# 3. Detección de bordes usando el detector de Canny
edges = cv2.Canny(blurred_img, 100, 200)

# 4. Detección de contornos
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Dibujar los contornos en la imagen original para visualización
contour_img = img.copy()
cv2.drawContours(contour_img, contours, -1, (0, 255, 0), 2)  # Dibuja en verde

# Visualizar el resultado
fig, axs = plt.subplots(1, 3, figsize=(15, 5))
axs[0].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
axs[0].set_title('Imagen Original')
axs[0].axis('off')

axs[1].imshow(edges, cmap='gray')
axs[1].set_title('Bordes (Canny)')
axs[1].axis('off')

axs[2].imshow(cv2.cvtColor(contour_img, cv2.COLOR_BGR2RGB))
axs[2].set_title('Contornos Detectados')
axs[2].axis('off')

plt.show()

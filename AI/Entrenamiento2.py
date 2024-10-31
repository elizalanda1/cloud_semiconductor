from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

# Cargar el dataset actualizado
df = pd.read_csv("caracteristicas_circuitos.csv")

# Seleccionar características y etiquetas
X = df[['num_contornos', 'area_total', 'perimetro_promedio', 'densidad_contornos']]
y = df['etiqueta']

# Dividir en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Configurar y entrenar el modelo KNN
modelo_knn = KNeighborsClassifier(n_neighbors=3)  # Puedes ajustar el número de vecinos
modelo_knn.fit(X_train, y_train)

# Realizar predicciones
y_pred = modelo_knn.predict(X_test)

# Evaluar el modelo
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"Precisión del modelo KNN: {accuracy:.2f}")
print("Reporte de clasificación KNN:")
print(report)

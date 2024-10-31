from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

# Cargar el dataset
ruta_csv = 'caracteristicas_circuitos.csv'  # Asegúrate de que esta ruta sea correcta
df = pd.read_csv(ruta_csv)

# Seleccionar características y etiquetas
X = df[['num_contornos', 'area_total', 'perimetro_promedio']]
y = df['etiqueta']

# Dividir en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Selección del modelo: SVM o Random Forest
modelo = RandomForestClassifier(random_state=42)  # Puedes cambiar a SVC() para probar SVM

# Entrenar el modelo
modelo.fit(X_train, y_train)

# Realizar predicciones
y_pred = modelo.predict(X_test)

# Evaluar el modelo
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"Precisión del modelo: {accuracy:.2f}")
print("Reporte de clasificación:")
print(report)

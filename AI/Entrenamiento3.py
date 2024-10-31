from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

# Cargar el dataset ampliado
df = pd.read_csv("caracteristicas_circuitos_aumentadas.csv")

# Seleccionar características y etiquetas
X = df[['num_contornos', 'area_total', 'perimetro_promedio', 'densidad_contornos']]
y = df['etiqueta']

# Dividir en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Configurar y entrenar el modelo Random Forest
modelo_rf = RandomForestClassifier(n_estimators=100, random_state=42)  # Puedes ajustar los estimadores según el rendimiento
modelo_rf.fit(X_train, y_train)

# Realizar predicciones
y_pred = modelo_rf.predict(X_test)

# Evaluar el modelo
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"Precisión del modelo Random Forest: {accuracy:.2f}")
print("Reporte de clasificación Random Forest:")
print(report)

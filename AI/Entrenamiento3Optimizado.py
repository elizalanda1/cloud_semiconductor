from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
import joblib


# Cargar el dataset ampliado
df = pd.read_csv("caracteristicas_circuitos_aumentadas.csv")

# Seleccionar características y etiquetas
X = df[['num_contornos', 'area_total', 'perimetro_promedio', 'densidad_contornos']]
y = df['etiqueta']

# Dividir en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Definir el modelo de Random Forest
modelo_rf = RandomForestClassifier(random_state=42)

# Definir el rango de hiperparámetros a probar
param_grid = {
    'n_estimators': [50, 100, 150],          # Número de árboles
    'max_depth': [None, 10, 20, 30],         # Profundidad máxima de los árboles
    'min_samples_split': [2, 5, 10],         # Número mínimo de muestras necesarias para dividir un nodo
    'min_samples_leaf': [1, 2, 4]            # Número mínimo de muestras en una hoja
}

# Configurar la búsqueda en cuadrícula
grid_search = GridSearchCV(estimator=modelo_rf, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=2)

# Realizar la búsqueda en cuadrícula
grid_search.fit(X_train, y_train)

# Obtener el mejor modelo y sus hiperparámetros
mejor_modelo = grid_search.best_estimator_
print("Mejores hiperparámetros:", grid_search.best_params_)

# Evaluar el mejor modelo en el conjunto de prueba
y_pred = mejor_modelo.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

# Guardar el mejor modelo encontrado en un archivo
joblib.dump(mejor_modelo, 'mejor_modelo_rf.pkl')
print("Modelo optimizado guardado como 'mejor_modelo_rf.pkl'")


print(f"Precisión del modelo optimizado: {accuracy:.2f}")
print("Reporte de clasificación del modelo optimizado:")
print(report)

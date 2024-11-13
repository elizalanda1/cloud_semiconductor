from pydobot import Dobot
from serial.tools import list_ports
import time

# Encuentra el puerto del Dobot
dobot_port = '/dev/cu.usbserial-1410'  # Asegúrate de que este puerto sea el correcto para el Dobot

# Conecta con el Dobot
dobot = Dobot(port=dobot_port, verbose=True)

try:
    # Imprime la posición inicial para referencia
    x, y, z, r, j1, j2, j3, j4 = dobot.pose()
    print(f"Posición inicial - x: {x}, y: {y}, z: {z}, r: {r}")

    # Mueve el brazo a la izquierda
    print("Moviendo a la izquierda...")
    dobot.move_to(x - 50, y, z, r, wait=True)  # Ajusta el valor restado de 'x' para el límite izquierdo
    time.sleep(1)

    # Mueve el brazo a la derecha
    print("Moviendo a la derecha...")
    dobot.move_to(x + 50, y, z, r, wait=True)  # Ajusta el valor sumado de 'x' para el límite derecho
    time.sleep(1)

finally:
    # Cierra la conexión al Dobot
    dobot.close()
    print("Conexión cerrada.")

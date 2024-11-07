import serial
from pydobot import Dobot
import time

# Definir los puertos
dobot_port = '/dev/cu.usbserial-14210'  # Puerto del Dobot
m5_port = '/dev/cu.usbserial-4152A9638D'  # Puerto del M5TimerCam

# Conectar al Dobot
dobot = Dobot(port=dobot_port, verbose=True)

# Conectar al M5TimerCam
esp = serial.Serial(m5_port, baudrate=115200, timeout=1)

# Función para enviar comando al M5 para abrir/cerrar el servo
def control_grip(command):
    if command == "open":
        esp.write(b'open\n')
    elif command == "close":
        esp.write(b'close\n')

# Ejemplo de secuencia de movimiento
try:
    # Mover el brazo a la posición inicial
    dobot.move_to(200, 0, 50, 0, wait=True)

    # Cerrar el agarre
    control_grip("close")
    time.sleep(2)

    # Mover el brazo a una nueva posición
    dobot.move_to(200, 0, -50, 0, wait=True)

    # Abrir el agarre para soltar el objeto
    control_grip("open")
    time.sleep(2)

    # Regresar a la posición inicial
    dobot.move_to(200, 0, 50, 0, wait=True)

finally:
    # Cerrar las conexiones
    dobot.close()
    esp.close()

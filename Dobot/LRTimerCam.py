import serial
import time
from pydobot import Dobot

# Inicializa la conexión con el Dobot y el M5TimerCam
dobot_port = '/dev/cu.usbserial-14210'  # Reemplaza con el puerto adecuado para el Dobot
m5_port = '/dev/cu.usbserial-4152A9638D'    # Reemplaza con el puerto adecuado para el M5TimerCam

dobot = Dobot(port=dobot_port, verbose=True)
m5 = serial.Serial(m5_port, 115200, timeout=1)

# Función para enviar comando al M5TimerCam
def send_to_m5(command):
    m5.write(command.encode())
    time.sleep(0.5)  # Espera para asegurar que el M5TimerCam reciba el comando

# Secuencia de movimientos con coordinación
try:
    # Mueve el Dobot a la posición inicial
    dobot.move_to(200, 0, 50, 0, wait=True)

    # Envía comando para cerrar el agarre
    send_to_m5('C')  # 'C' para cerrar

    # Mueve el Dobot hacia abajo
    dobot.move_to(200, 0, -50, 0, wait=True)

    # Envía comando para abrir el agarre y soltar el objeto
    send_to_m5('O')  # 'O' para abrir

    # Regresa el Dobot a la posición inicial
    dobot.move_to(200, 0, 50, 0, wait=True)

finally:
    # Cierra la conexión
    dobot.close()
    m5.close()

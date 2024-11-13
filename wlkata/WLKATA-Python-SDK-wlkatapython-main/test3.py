import wlkatapython
import serial
import time

# Configuración del puerto serial y el brazo robótico
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()  # Instancia del Mirobot

print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")

print("Ejecutando homing...")
mirobot.homing()
time.sleep(2)
print("Comando homing enviado.")

# Prueba movimiento de coordenadas
print("Enviando movimiento...")
mirobot.writecoordinate(0, 0, 100, 0, 100, 0, 0, 0)
time.sleep(2)
print("Movimiento enviado.")

serial_port.close()
print("Puerto serial cerrado.")


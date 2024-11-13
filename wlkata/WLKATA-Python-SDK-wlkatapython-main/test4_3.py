import wlkatapython
import serial
import time

print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")



# Mover a la posición (X=50, Y=-50, Z=30)
print("Moviendo a la posición (X=50, Y=-50, Z=30)...")
mirobot.writecoordinate(0, 0, 50, -50, 30, 0, 0, 0)
time.sleep(5)
print("Movimiento completado.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

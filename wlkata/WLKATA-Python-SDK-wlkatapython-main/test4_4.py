import wlkatapython
import serial
import time

print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")



# Mover a la posición (X=200, Y=100, Z=150)
print("Moviendo a la posición (X=200, Y=100, Z=150)...")
mirobot.writecoordinate(0, 0, 200, 100, 150, 0, 0, 0)
time.sleep(5)
print("Movimiento completado.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

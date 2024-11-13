import wlkatapython
import serial
import time

print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")


# Mover a la posición (X=100, Y=0, Z=50)
print("Moviendo a la posición (X=100, Y=0, Z=50)...")
mirobot.writecoordinate(0, 0, 100, 0, 50, 0, 0, 0)
time.sleep(5)
print("Movimiento completado.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

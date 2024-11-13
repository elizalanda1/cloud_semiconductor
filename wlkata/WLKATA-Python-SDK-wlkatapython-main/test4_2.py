import wlkatapython
import serial
import time

print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")


# Mover a la posición (X=150, Y=50, Z=100)
print("Moviendo a la posición (X=150, Y=50, Z=100)...")
mirobot.writecoordinate(0, 0, 150, 50, 100, 0, 0, 0)
time.sleep(5)
print("Movimiento completado.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

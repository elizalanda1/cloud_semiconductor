from serial.tools import list_ports
import pydobot

available_ports = list_ports.comports()
print(f'available ports: {[x.device for x in available_ports]}')

# Selecciona directamente el puerto correcto
port = '/dev/cu.usbserial-1420'  # Cambia esto si es necesario

device = pydobot.Dobot(port=port, verbose=True)

(x, y, z, r, j1, j2, j3, j4) = device.pose()
print(f'x:{x} y:{y} z:{z} j1:{j1} j2:{j2} j3:{j3} j4:{j4}')

device.move_to(x + 20, y, z, r, wait=False)
device.move_to(x, y, z, r, wait=True)  # Espera hasta que termine el movimiento

device.close()

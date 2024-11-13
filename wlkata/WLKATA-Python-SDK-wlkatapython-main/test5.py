import wlkatapython
import serial
import time

def esperar_estado_idle(mirobot, timeout=20):
    """Espera hasta que el robot esté en estado 'Idle' y en el modo adecuado o hasta que se agote el tiempo de espera."""
    tiempo_inicial = time.time()
    while time.time() - tiempo_inicial < timeout:
        estado = mirobot.getStatus()
        if estado == -1:
            print("Error temporal al obtener el estado. Reintentando...")
            time.sleep(1)  # Espera antes de reintentar
            continue
        print("Estado actual:", estado)
        if isinstance(estado, dict) and estado.get('state') == 'Idle' and estado.get('mooe') == '1':
            return True
        time.sleep(0.5)
    return False

# Configuración de conexión
print("Iniciando puerto serial...")
serial_port = serial.Serial("/dev/cu.usbserial-1420", 115200)
mirobot = wlkatapython.Wlkata_UART()
mirobot.init(serial_port, -1)
print("Conexión establecida.")

# Reiniciar el robot para un estado limpio
print("Reiniciando el robot...")
mirobot.restart()
time.sleep(2)

# Homing
print("Ejecutando homing...")
mirobot.homing()
if esperar_estado_idle(mirobot, timeout=20):
    print("Homing completado.")
else:
    print("Error: El robot no alcanzó el estado 'Idle' después del homing.")
    serial_port.close()
    exit()

# Movimiento relativo: Primer movimiento
print("Enviando primer movimiento relativo...")
mirobot.writecoordinate(0, 1, 50, 50, 0, 0, 0, 0)  # Usamos '1' para modo relativo
if esperar_estado_idle(mirobot):
    print("Primer movimiento relativo completado.")
else:
    print("Error: El robot no alcanzó el estado 'Idle' después del primer movimiento.")
    serial_port.close()
    exit()

# Comando de diagnóstico
print("Enviando comando de diagnóstico...")
estado_actual = mirobot.getStatus()
print(f"Estado actual del robot: {estado_actual}")

# Pausa adicional antes del segundo movimiento
print("Esperando brevemente antes del segundo movimiento...")
time.sleep(2)  # Pausa de 2 segundos

# Movimiento relativo: Segundo movimiento
print("Enviando segundo movimiento relativo...")
mirobot.writecoordinate(0, 1, -50, -50, 0, 0, 0, 0)

# Verificación de estado
if esperar_estado_idle(mirobot):
    print("Segundo movimiento relativo completado.")
else:
    print("Error: El robot no alcanzó el estado 'Idle' después del segundo movimiento.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

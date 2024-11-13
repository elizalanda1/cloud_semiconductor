import wlkatapython
import serial
import time

def esperar_estado_idle(mirobot, timeout=20):
    """Espera hasta que el robot esté en estado 'Idle' y en modo adecuado o hasta que se agote el tiempo de espera."""
    tiempo_inicial = time.time()
    while time.time() - tiempo_inicial < timeout:
        estado = mirobot.getStatus()
        if estado == -1:
            print("Error temporal al obtener el estado. Reintentando...")
            time.sleep(1)  # Espera antes de reintentar
            continue
        print("Estado actual durante homing:", estado)
        if isinstance(estado, dict) and estado.get('state') == 'Idle' and estado.get('mooe') == '0':
            return True
        time.sleep(0.5)
    return False

def verificar_idle_y_reintentar(mirobot, timeout=10):
    """Verifica el estado 'Idle' y reintenta hasta confirmar que está listo para el próximo movimiento."""
    tiempo_inicial = time.time()
    while time.time() - tiempo_inicial < timeout:
        estado = mirobot.getStatus()
        print("Verificando estado tras movimiento:", estado)
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

# Primer movimiento
print("Enviando primer movimiento...")
mirobot.writecoordinate(0, 0, 200, 100, 150, 0, 0, 0)
if verificar_idle_y_reintentar(mirobot):
    print("Primer movimiento completado.")
else:
    print("Error: El robot no alcanzó el estado 'Idle' después del primer movimiento.")
    serial_port.close()
    exit()

# Comando intermedio de diagnóstico
print("Enviando comando de diagnóstico...")
estado_actual = mirobot.getStatus()
print(f"Estado actual del robot: {estado_actual}")

# Pausa adicional antes del segundo movimiento
print("Esperando brevemente antes del segundo movimiento...")
time.sleep(2)  # Pausa de 2 segundos

# Segundo movimiento
print("Enviando segundo movimiento...")
mirobot.writecoordinate(0, 0, 100, 0, 50, 0, 0, 0)

# Verificación y reintento
intentos = 0
while intentos < 3:
    if verificar_idle_y_reintentar(mirobot):
        print("Segundo movimiento completado.")
        break
    else:
        print(f"Reintentando segundo movimiento, intento {intentos + 1}...")
        mirobot.writecoordinate(0, 0, 100, 0, 50, 0, 0, 0)
        intentos += 1
        time.sleep(1)
else:
    print("Error: El robot no alcanzó el estado 'Idle' después del segundo movimiento.")

# Cerrar el puerto serial
serial_port.close()
print("Puerto serial cerrado.")

import asyncio
from bleak import BleakClient, BleakError

# Dirección MAC de la caminadora (obtenida del escaneo)
address = "1422CE35-1129-9D4B-D12E-FB5E1FD718AA"
# UUID de la característica que controla la caminadora
char_uuid = "0000fe01-0000-1000-8000-00805f9b34fb"  # UUID específico para la caminadora

# Comando que podría hacer que la caminadora se mueva
move_command = bytearray([0xF8, 0xA5, 0x4D, 0x50, 0x31, 0x14, 0x0B, 0xB4, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x15, 0x1B, 0x00, 0x00, 0x80, 0xFD])

# Número máximo de reintentos
max_retries = 5

async def connect_and_send_command():
    client = BleakClient(address)
    try:
        # Intentar conectar al dispositivo con reintentos
        for attempt in range(1, max_retries + 1):
            try:
                print(f"Intentando conectar: {attempt}/{max_retries}...")
                await client.connect()

                if client.is_connected:
                    print(f"Conectado a la caminadora: {address}")
                    break  # Conectado con éxito, salir del bucle
                else:
                    print(f"Fallo al conectar en el intento {attempt}/{max_retries}")
                    await asyncio.sleep(3)  # Esperar 3 segundos antes de intentar de nuevo

            except BleakError as e:
                print(f"Error durante la conexión: {e}")
                await asyncio.sleep(3)  # Esperar 3 segundos antes de intentar de nuevo

        else:
            print("No se pudo conectar a la caminadora después de varios intentos.")
            return  # Salir si no fue posible conectarse

        # Comando inicial para mover la caminadora
        await client.write_gatt_char(char_uuid, move_command)
        print("Comando enviado para mover la caminadora")

        # Mantener la aplicación en ejecución hasta que el usuario escriba 'exit'
        while True:
            user_input = input("Escribe 'exit' para desconectar y salir: ").strip().lower()
            if user_input == "exit":
                print("Desconectando de la caminadora...")
                break

    except Exception as e:
        print(f"Ha ocurrido un error: {e}")

    finally:
        # Intentar desconectar antes de salir
        if client.is_connected:
            await client.disconnect()
            print("Desconectado de la caminadora.")

# Ejecutar el bucle de eventos asyncio
asyncio.run(connect_and_send_command())

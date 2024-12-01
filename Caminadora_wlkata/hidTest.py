import hid

VENDOR_ID = 0x1DD8  # Vendor ID del gamepad
PRODUCT_ID = 0x000F  # Product ID del gamepad

try:
    device = hid.device()
    device.open(VENDOR_ID, PRODUCT_ID)
    print(f"Conectado al dispositivo: {device.get_manufacturer_string()} {device.get_product_string()}")

    device.set_nonblocking(True)

    print("Interactúa con el gamepad (Ctrl+C para salir):")

    while True:
        data = device.read(64)  # Leer datos del dispositivo
        if data:
            # Interpretar joysticks
            joystick_left_x = data[0]
            joystick_left_y = data[1]
            joystick_right_x = data[2]
            joystick_right_y = data[3]

            # Interpretar botones
            buttons_byte_1 = data[4]
            buttons_byte_2 = data[5]

            # Imprimir resultados interpretados
            print(f"Joystick Izquierdo: X={joystick_left_x}, Y={joystick_left_y}")
            print(f"Joystick Derecho: X={joystick_right_x}, Y={joystick_right_y}")
            print(f"Botones (byte 1): {bin(buttons_byte_1)}")
            print(f"Botones (byte 2): {bin(buttons_byte_2)}")
            print("-" * 40)

except Exception as e:
    print(f"Error al interactuar con el dispositivo HID: {e}")

finally:
    if 'device' in locals():
        device.close()

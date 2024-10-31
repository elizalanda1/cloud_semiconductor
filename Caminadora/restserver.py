from flask import Flask, request
from ph4_walkingpad import pad
from ph4_walkingpad.pad import WalkingPad, Controller
from ph4_walkingpad.utils import setup_logging
import asyncio
import yaml
import psycopg2
from datetime import date
#Comentario prueba

app = Flask(__name__)

minimal_cmd_space = 0.69
log = setup_logging()
pad.logger = log
ctler = Controller()

last_status = {
    "steps": None,
    "distance": None,
    "time": None
}

def load_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

async def connect():
    address = load_config()['address']
    print("Connecting to {0}".format(address))
    await ctler.run(address)
    await asyncio.sleep(minimal_cmd_space)

async def disconnect():
    await ctler.disconnect()
    await asyncio.sleep(minimal_cmd_space)

async def keep_belt_running():
    while True:
        await ctler.ask_stats()
        await asyncio.sleep(0.2)  # Verifica cada 200ms

        if ctler.last_status.belt_state != 1 or ctler.last_status.mode != WalkingPad.MODE_MANUAL:
            await ctler.switch_mode(WalkingPad.MODE_MANUAL)
            await asyncio.sleep(0.2)
            await ctler.start_belt()
        await asyncio.sleep(0.2)


@app.route("/startwalk", methods=['POST'])
async def start_walk():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)  # Cambiar al modo manual
        await asyncio.sleep(0.5)

        # Enviar comando de arranque de banda
        await ctler.start_belt()
        await asyncio.sleep(0.5)

        #bajar velocidad
        await ctler.change_speed(5)
        await asyncio.sleep(0.5)
    
        #asyncio.create_task(keep_belt_running())  # Mantener la banda corriendo
    finally:
        await disconnect()

    return last_status

@app.route("/startwalk2", methods=['POST'])
async def walk2():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)  # Cambiar al modo manual
        await asyncio.sleep(0.5)

        # Enviar comando de arranque de banda
        await ctler.start_belt()
        await asyncio.sleep(0.5)

        # Bajar velocidad
        await ctler.change_speed(5)
        await asyncio.sleep(0.5)

        # Esperar 2 segundos antes de detener la caminadora
        await asyncio.sleep(8)
        await ctler.switch_mode(WalkingPad.MODE_STANDBY)  # Detener la caminadora
        await asyncio.sleep(minimal_cmd_space)
    finally:
        await disconnect()

    return last_status


@app.route("/finishwalk", methods=['POST'])
async def finish_walk():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_STANDBY)  # Detener la caminadora
        await asyncio.sleep(minimal_cmd_space)
    finally:
        await disconnect()

    return last_status

@app.route("/current_mode", methods=['GET'])
async def get_current_mode():
    try:
        await connect()  # Conectar con la caminadora
        await ctler.ask_stats()  # Solicitar el estado actual
        await asyncio.sleep(minimal_cmd_space)
        
        # Obtener el modo actual
        mode = ctler.last_status.manual_mode
        if mode == WalkingPad.MODE_STANDBY:
            return {"current_mode": "standby"}
        elif mode == WalkingPad.MODE_MANUAL:
            return {"current_mode": "manual"}
        elif mode == WalkingPad.MODE_AUTOMAT:
            return {"current_mode": "auto"}
        else:
            return {"current_mode": "unknown"}, 400
    finally:
        await disconnect()  # Desconectar después de obtener el estado

@app.route("/speed", methods=['POST'])
async def speed():
    try:
        await connect()
        await ctler.switch_mode(WalkingPad.MODE_MANUAL)
        await asyncio.sleep(0.5)
        
        await ctler.change_speed(5)
        await asyncio.sleep(0.5)

    finally:
        await disconnect()
    
    return "changed"




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5678, processes=1, threaded=False)

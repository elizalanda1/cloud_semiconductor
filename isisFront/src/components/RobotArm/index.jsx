import React from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import useGamepad from './useGamepad'; // Importar el hook personalizado

const RobotArmControl = () => {
  const { gamepadConnected, gamepadState } = useGamepad();

  const handleGamepadInput = () => {
    if (gamepadState) {
      const { axes, buttons } = gamepadState;

      // Mostrar los valores de los ejes y botones en la consola
      console.log('Ejes:', axes);
      console.log('Botones:', buttons);

      // Ejemplo de lógica para interpretar la entrada del gamepad
      // Puedes adaptar esto para controlar los movimientos del brazo
      if (axes[0] > 0.5) {
        console.log('Eje 0: Mover a la derecha');
      }
      if (axes[0] < -0.5) {
        console.log('Eje 0: Mover a la izquierda');
      }
      if (axes[1] > 0.5) {
        console.log('Eje 1: Mover hacia abajo');
      }
      if (axes[1] < -0.5) {
        console.log('Eje 1: Mover hacia arriba');
      }

      // Botones
      buttons.forEach((pressed, index) => {
        if (pressed) {
          console.log(`Botón ${index} presionado`);
        }
      });
    }
  };

  return (
    <div className="robot-arm-control">
      <h3>── MOTION CONTROL ──</h3>

      <div>
        {gamepadConnected ? (
          <p>Gamepad conectado. ¡Listo para controlar!</p>
        ) : (
          <p>No se detecta un gamepad. Conéctalo para empezar.</p>
        )}
      </div>

      {gamepadConnected && (
        <Button type="primary" onClick={handleGamepadInput}>
          Usar entrada del Gamepad
        </Button>
      )}

      {/* Botón para cambiar entre modos */}
      <Button
        type="default"
        icon={<SwapOutlined />}
        style={{ marginTop: '1rem' }}
      >
        Cambiar modo
      </Button>
    </div>
  );
};

export default RobotArmControl;

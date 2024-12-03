import { useEffect, useState } from 'react';

const useGamepad = () => {
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [gamepadState, setGamepadState] = useState(null);

  useEffect(() => {
    const handleGamepadConnected = (event) => {
      console.log('Gamepad conectado:', event.gamepad);
      setGamepadConnected(true);
    };

    const handleGamepadDisconnected = (event) => {
      console.log('Gamepad desconectado:', event.gamepad);
      setGamepadConnected(false);
      setGamepadState(null);
    };

    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();
      const activeGamepad = gamepads.find((gp) => gp !== null);
      if (activeGamepad) {
        setGamepadState({
          axes: activeGamepad.axes,
          buttons: activeGamepad.buttons.map((button) => button.pressed),
        });
      }
      // Continuar escuchando
      requestAnimationFrame(updateGamepadState);
    };

    // Añadir listeners de conexión y desconexión
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Iniciar bucle de actualización si hay gamepads conectados
    if (gamepadConnected) {
      requestAnimationFrame(updateGamepadState);
    }

    // Limpiar listeners
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [gamepadConnected]);

  return { gamepadConnected, gamepadState };
};

export default useGamepad;

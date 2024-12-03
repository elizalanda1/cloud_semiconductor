import React from 'react';
import gamepadUpside from '../../assets/gamepad_upside.jpg'; // Ruta a la imagen superior
import './GamepadUpside.css';

const GamepadUpside = ({ isGamepadMode }) => {
  return (
    <div className="gamepad-upside">
      <img src={gamepadUpside} alt="Gamepad Superior" className="gamepad-image" />
      {isGamepadMode && (
        <div className="labels">
          <span className="label b6">Joint -</span>
          <span className="label b7">Joint +</span>
          <span className="label b5">Caminadora</span>
        </div>
      )}
    </div>
  );
};

export default GamepadUpside;

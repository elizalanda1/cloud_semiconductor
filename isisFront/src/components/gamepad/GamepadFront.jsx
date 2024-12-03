import React from 'react';
import gamepadFront from '../../assets/gamepad_front.jpg'; // Ruta a la imagen del gamepad frontal
import './GamepadFront.css';

const GamepadFront = ({ isGamepadMode }) => {
  return (
    <div className="gamepad-front">
      <img src={gamepadFront} alt="Gamepad Frontal" className="gamepad-image" />
      {isGamepadMode && (
        <div className="labels">
          <span className="label b0">Grip ON</span>
          <span className="label b1">+ Ángulo</span>
          <span className="label b2">Grip OFF</span>
          <span className="label b3">- Ángulo</span>
        </div>
      )}
    </div>
  );
};

export default GamepadFront;

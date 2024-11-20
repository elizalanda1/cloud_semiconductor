// src/components/RobotArmControl.jsx

import React, { useState } from 'react';
import { Button } from 'antd';
import { moveArm } from '../../services/Flask';
import './index.css';

const RobotArmControl = () => {
  const [angles, setAngles] = useState({
    J1: 0,
    J2: 0,
    J3: 0,
    J4: 0,
    J5: 0,
    J6: 0,
  });

  const updateAngle = (joint, delta) => {
    setAngles((prevAngles) => ({
      ...prevAngles,
      [joint]: prevAngles[joint] + delta,
    }));
  };

  const handleMove = async () => {
    console.log('Enviando ángulos:', angles); // Para depuración
    try {
      const response = await moveArm(angles);
      console.log('Respuesta del servidor:', response);
    } catch (error) {
      console.error('Error al mover el brazo robótico:', error);
    }
  };

  return (
    <div className="robot-arm-control">
      <h3>── MOTION CONTROL ──</h3>
      {[1, 2, 3, 4, 5, 6].map((joint) => (
        <div className="control-row" key={joint}>
          <span>J{joint}:</span>
          <Button onClick={() => updateAngle(`J${joint}`, -5)}>J{joint}-</Button>
          <Button onClick={() => updateAngle(`J${joint}`, 5)}>J{joint}+</Button>
          <span>{angles[`J${joint}`]}</span>
        </div>
      ))}
      <Button type="primary" onClick={handleMove} style={{ marginTop: '1rem' }}>
        Enviar Movimiento
      </Button>
    </div>
  );
};

export default RobotArmControl;

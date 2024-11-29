// src/components/RobotArmControl.jsx

import React, { useState } from 'react';
import { Button, Slider, Row, Col } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
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

  const [useSliders, setUseSliders] = useState(false); // Controla el modo de la interfaz

  const updateAngleAndMove = async (joint, newAngle) => {
    const updatedAngles = {
      ...angles,
      [joint]: newAngle,
    };
    setAngles(updatedAngles);

    console.log(`Enviando ángulos: ${JSON.stringify(updatedAngles)}`);

    try {
      const response = await moveArm(updatedAngles);
      console.log('Respuesta del servidor:', response);
    } catch (error) {
      console.error('Error al mover el brazo robótico:', error);
    }
  };

  const handleSliderChange = async (joint, value) => {
    updateAngleAndMove(joint, value); // Enviar el nuevo valor al servidor
  };

  return (
    <div className="robot-arm-control">
      <h3>── MOTION CONTROL ──</h3>

      {useSliders ? (
        // Modo con sliders
        <>
          {[1, 2, 3, 4, 5, 6].map((joint) => (
            <Row className="control-row" key={joint} gutter={[16, 16]} align="middle">
              <Col span={4}>
                <span>J{joint}:</span>
              </Col>
              <Col span={16}>
                <Slider
                  min={-180}
                  max={180}
                  value={angles[`J${joint}`]}
                  onChange={(value) => setAngles((prev) => ({ ...prev, [`J${joint}`]: value }))}
                  onAfterChange={(value) => handleSliderChange(`J${joint}`, value)} // Enviar al soltar el slider
                  tooltip={{ formatter: (value) => `${value}°` }}
                />
              </Col>
              <Col span={4}>
                <span>{angles[`J${joint}`]}°</span>
              </Col>
            </Row>
          ))}
        </>
      ) : (
        // Modo con botones
        <>
          {[1, 2, 3, 4, 5, 6].map((joint) => (
            <div className="control-row" key={joint}>
              <span>J{joint}:</span>
              <Button
                onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] - 5)}
              >
                J{joint}-
              </Button>
              <Button
                onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] + 5)}
              >
                J{joint}+
              </Button>
              <span>{angles[`J${joint}`]}</span>
            </div>
          ))}
        </>
      )}

      {/* Botón de switch */}
      <Button
        type="default"
        icon={<SwapOutlined />}
        onClick={() => setUseSliders(!useSliders)}
        style={{ marginTop: '1rem' }}
      >
        Cambiar a {useSliders ? 'Botones' : 'Sliders'}
      </Button>
    </div>
  );
};

export default RobotArmControl;

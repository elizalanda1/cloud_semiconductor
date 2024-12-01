import React, { useState } from 'react';
import { Button, Slider, Row, Col } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { moveArm, moveArm2, stopMoveArm2 } from '../../services/Flask';
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

  const [controlMode, setControlMode] = useState('sliders'); // 'sliders', 'buttons', 'global'
  const [isArmActive, setIsArmActive] = useState(false); // Controla si el brazo está activado

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

  const handleActivation = async () => {
    try {
      await moveArm2();
      setIsArmActive(true);
      console.log('Brazo activado.');
    } catch (error) {
      console.error('Error al activar el brazo:', error);
    }
  };

  const handleDeactivation = async () => {
    try {
      await stopMoveArm2();
      setIsArmActive(false);
      console.log('Brazo desactivado.');
    } catch (error) {
      console.error('Error al desactivar el brazo:', error);
    }
  };

  return (
    <div className="robot-arm-control">
      <h3>── MOTION CONTROL ──</h3>

      {controlMode === 'sliders' && (
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
                  onAfterChange={(value) => updateAngleAndMove(`J${joint}`, value)}
                  tooltip={{ formatter: (value) => `${value}°` }}
                />
              </Col>
              <Col span={4}>
                <span>{angles[`J${joint}`]}°</span>
              </Col>
            </Row>
          ))}
        </>
      )}

      {controlMode === 'buttons' && (
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

      {controlMode === 'global' && (
        // Modo global con activación y desactivación
        <div className="global-control">
          <h4>Control Global del Brazo</h4>
          {!isArmActive ? (
            <Button type="primary" onClick={handleActivation}>
              Activar Movimiento
            </Button>
          ) : (
            <Button type="danger" onClick={handleDeactivation}>
              Detener Movimiento
            </Button>
          )}
        </div>
      )}

      {/* Botón para cambiar entre modos */}
      <Button
        type="default"
        icon={<SwapOutlined />}
        onClick={() =>
          setControlMode(
            controlMode === 'sliders' ? 'buttons' : controlMode === 'buttons' ? 'global' : 'sliders'
          )
        }
        style={{ marginTop: '1rem' }}
      >
        Cambiar a {controlMode === 'sliders' ? 'Botones' : controlMode === 'buttons' ? 'Global' : 'Sliders'}
      </Button>
    </div>
  );
};

export default RobotArmControl;

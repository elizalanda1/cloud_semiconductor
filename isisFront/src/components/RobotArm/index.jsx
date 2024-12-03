import React, { useState, useEffect } from 'react';
import { Button, Slider, Row, Col } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { moveArm } from '../../services/Flask'; // Importa la función para enviar datos al backend
import './index.css';

const RobotArmControl = ({ setControlMode, controlMode }) => {
  const [angles, setAngles] = useState({
    J1: 0,
    J2: 0,
    J3: 0,
    J4: 0,
    J5: 0,
    J6: 0,
  });

  const [selectedJoint, setSelectedJoint] = useState(1); // Articulación seleccionada
  const [isGamepadConnected, setIsGamepadConnected] = useState(false); // Estado del gamepad
  const [isPumpActive, setIsPumpActive] = useState(false); // Controla si el grip está activado
  const [isWalkingPadActive, setIsWalkingPadActive] = useState(false); // Controla si la caminadora está activa

  // Actualizar el ángulo y mover el brazo
  const updateAngleAndMove = async (joint, newAngle) => {
    const updatedAngles = {
      ...angles,
      [joint]: newAngle,
    };
    setAngles(updatedAngles);

    try {
      await moveArm(updatedAngles, isPumpActive ? 1 : 0); // Incluir el estado actual del pump
      console.log(`Moviendo: ${joint} a ${newAngle}, pump: ${isPumpActive ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error al mover el brazo:', error);
    }
  };

  // Activar/desactivar el grip
  const togglePump = async () => {
    setIsPumpActive((prev) => !prev);

    try {
      await moveArm(angles, !isPumpActive ? 1 : 0); // Llama al backend para activar/desactivar el grip
      console.log(`Grip ${!isPumpActive ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error al controlar el grip:', error);
    }
  };

  // Activar la caminadora
  const runWalkingPad = async () => {
    setIsWalkingPadActive(true);
    console.log('Caminadora activada.');

    setTimeout(() => {
      setIsWalkingPadActive(false);
      console.log('Caminadora desactivada.');
    }, 7000);

    try {
      await moveArm(angles, isPumpActive ? 1 : 0, true); // Incluir estado del pump y caminadora
    } catch (error) {
      console.error('Error al activar la caminadora:', error);
    }
  };

  // Manejar el cambio de modo
  const handleModeChange = () => {
    const nextMode = controlMode === 'sliders' ? 'buttons' : controlMode === 'buttons' ? 'gamepad' : 'sliders';
    setControlMode(nextMode);
  };

  // Manejo del gamepad
  useEffect(() => {
    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0]; // Usar el primer gamepad conectado

      if (gamepad) {
        setIsGamepadConnected(true);

        // Manejo de botones del gamepad
        const { buttons } = gamepad;

        // Cambiar articulación seleccionada
        if (buttons[6].pressed) {
          setSelectedJoint((prev) => Math.max(1, prev - 1));
        }
        if (buttons[7].pressed) {
          setSelectedJoint((prev) => Math.min(6, prev + 1));
        }

        // Cambiar ángulos de la articulación seleccionada
        if (buttons[3].pressed) {
          updateAngleAndMove(`J${selectedJoint}`, angles[`J${selectedJoint}`] - 5);
        }
        if (buttons[1].pressed) {
          updateAngleAndMove(`J${selectedJoint}`, angles[`J${selectedJoint}`] + 5);
        }

        // Control del grip
        if (buttons[0].pressed && !isPumpActive) {
          togglePump();
        }
        if (buttons[2].pressed && isPumpActive) {
          togglePump();
        }

        // Activar la caminadora
        if (buttons[5].pressed && !isWalkingPadActive) {
          runWalkingPad();
        }
      } else {
        setIsGamepadConnected(false); // No hay gamepad conectado
      }
    };

    const interval = setInterval(handleGamepadInput, 100);

    return () => clearInterval(interval);
  }, [angles, selectedJoint, isPumpActive, isWalkingPadActive]);

  return (
    <div className="robot-arm-control">
      <h3>── MOTION CONTROL ──</h3>

      {/* Indicador de articulación seleccionada en modo gamepad */}
      {controlMode === 'gamepad' && (
        <div>
          {isGamepadConnected ? (
            <p>Controlling axis: {selectedJoint}</p>
          ) : (
            <p style={{ color: 'red' }}>Gamepad not detected. Plug it in to use this mode.</p>
          )}
        </div>
      )}

      {/* Controles de sliders */}
      {controlMode === 'sliders' && (
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

      {/* Controles con botones */}
      {controlMode === 'buttons' && (
        <>
          {[1, 2, 3, 4, 5, 6].map((joint) => (
            <Row className="control-row" key={joint} gutter={[16, 16]} align="middle">
              <Col span={4}>
                <span>J{joint}:</span>
              </Col>
              <Col span={20}>
                <Button onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] - 5)}>
                  J{joint} -
                </Button>
                <Button onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] + 5)}>
                  J{joint} +
                </Button>
              </Col>
            </Row>
          ))}
        </>
      )}

      {/* Botones adicionales */}
      <div className="additional-controls" style={{ marginTop: '1rem' }}>
        <Button
          type={isPumpActive ? 'danger' : 'primary'}
          onClick={togglePump}
          style={{ marginRight: '1rem' }}
        >
          {isPumpActive ? 'Deactivate Grip' : 'Activate Grip'}
        </Button>
        <Button
          type="default"
          onClick={runWalkingPad}
          disabled={isWalkingPadActive}
        >
          {isWalkingPadActive ? 'conveyor belt running' : 'Start Conveyor Band'}
        </Button>
      </div>

      {/* Botón para cambiar entre modos */}
      <Button
        type="default"
        icon={<SwapOutlined />}
        onClick={handleModeChange}
        style={{ marginTop: '1rem' }}
      >
        Change {controlMode === 'sliders' ? 'Buttons' : controlMode === 'buttons' ? 'Gamepad' : 'Sliders'}
      </Button>
    </div>
  );
};

export default RobotArmControl;

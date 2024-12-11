import React, { useState, useEffect } from 'react';
import { Button, Slider, Row, Col, Divider, Typography, Tag } from 'antd';
import { SwapOutlined, ToolOutlined, StopOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { moveArm } from '../../services/Flask'; 
import './index.css';

const { Text, Title } = Typography;

const RobotArmControl = ({ setControlMode, controlMode, onCommandSend, onAnglesChange, onGamepadStatusChange }) => {
  // Initialize in "buttons" mode
  const [angles, setAngles] = useState({
    J1: 0,
    J2: 0,
    J3: 0,
    J4: 0,
    J5: 0,
    J6: 0,
  });

  const [selectedJoint, setSelectedJoint] = useState(1); 
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [isWalkingPadActive] = useState(false); // Walking pad no longer used

  // Notify angle changes
  const notifyAnglesChange = (updatedAngles) => {
    setAngles(updatedAngles);
    if (onAnglesChange) {
      onAnglesChange(updatedAngles);
    }
  };

  const updateAngleAndMove = async (joint, newAngle) => {
    const updatedAngles = {
      ...angles,
      [joint]: newAngle,
    };
    notifyAnglesChange(updatedAngles);

    try {
      await moveArm(updatedAngles, isPumpActive ? 1 : 0);
      if (onCommandSend) {
        onCommandSend(`Moving: ${joint} to ${newAngle}°, grip: ${isPumpActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error('Error moving the arm:', error);
    }
  };

  const togglePump = async () => {
    setIsPumpActive((prev) => !prev);

    try {
      await moveArm(angles, !isPumpActive ? 1 : 0);
      if (onCommandSend) {
        onCommandSend(`Grip ${!isPumpActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error('Error controlling the grip:', error);
    }
  };

  const handleModeChange = () => {
    const nextMode = controlMode === 'sliders' ? 'buttons' : controlMode === 'buttons' ? 'gamepad' : 'sliders';
    setControlMode(nextMode);
    if (onCommandSend) {
      onCommandSend(`Changing to mode: ${nextMode}`);
    }
  };

  useEffect(() => {
    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (gamepad && !isGamepadConnected) {
        setIsGamepadConnected(true);
        if (onGamepadStatusChange) onGamepadStatusChange(true);
      } else if (!gamepad && isGamepadConnected) {
        setIsGamepadConnected(false);
        if (onGamepadStatusChange) onGamepadStatusChange(false);
      }

      if (gamepad) {
        const { buttons } = gamepad;

        if (buttons[6].pressed) {
          setSelectedJoint((prev) => Math.max(1, prev - 1));
        }
        if (buttons[7].pressed) {
          setSelectedJoint((prev) => Math.min(6, prev + 1));
        }

        if (buttons[3].pressed) {
          updateAngleAndMove(`J${selectedJoint}`, angles[`J${selectedJoint}`] - 5);
        }
        if (buttons[1].pressed) {
          updateAngleAndMove(`J${selectedJoint}`, angles[`J${selectedJoint}`] + 5);
        }

        // Grip buttons
        if (buttons[0].pressed && !isPumpActive) {
          togglePump();
        }
        if (buttons[2].pressed && isPumpActive) {
          togglePump();
        }
      }
    };

    const interval = setInterval(handleGamepadInput, 100);
    return () => clearInterval(interval);
  }, [angles, selectedJoint, isPumpActive, isGamepadConnected, onGamepadStatusChange]);

  return (
    <div className="robot-arm-control">
      <Title level={4} style={{ textAlign: 'center', marginBottom: '16px' }}>── MOTION CONTROL ──</Title>

      {controlMode === 'gamepad' && (
        <div style={{ marginBottom: '16px' }}>
          {isGamepadConnected ? (
            <Text strong>
              Controlling Axis: <Tag color="blue">J{selectedJoint}</Tag>
            </Text>
          ) : (
            <Text type="danger">Gamepad not detected. Connect it to use this mode.</Text>
          )}
        </div>
      )}

      {controlMode === 'sliders' && (
        <>
          {[1, 2, 3, 4, 5, 6].map((joint) => (
            <div className="control-row" key={joint} style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ marginBottom: '4px', fontSize: '1rem', fontWeight: 'bold', color: '#555' }}>J{joint}: {angles[`J${joint}`]}°</span>
              <Slider
                min={-180}
                max={180}
                value={angles[`J${joint}`]}
                onChange={(value) => notifyAnglesChange({ ...angles, [`J${joint}`]: value })}
                onAfterChange={(value) => updateAngleAndMove(`J${joint}`, value)}
                tooltip={{ formatter: (value) => `${value}°` }}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </>
      )}

      {controlMode === 'buttons' && (
        <>
          {[1, 2, 3, 4, 5, 6].map((joint, index) => (
            <React.Fragment key={joint}>
              <div className="control-row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px', fontWeight: 'bold' }}>J{joint}:</span>
                <Button 
                  onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] - 5)} 
                  style={{ marginRight: '8px' }} 
                  icon={<DownOutlined />}
                >
                  -5°
                </Button>
                <Button 
                  onClick={() => updateAngleAndMove(`J${joint}`, angles[`J${joint}`] + 5)} 
                  icon={<UpOutlined />}
                >
                  +5°
                </Button>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#333' }}>
                  {angles[`J${joint}`]}°
                </span>
              </div>
              {index < 5 && <Divider style={{ margin: '8px 0' }} />}
            </React.Fragment>
          ))}
        </>
      )}

      <div className="additional-controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Button
          type={isPumpActive ? 'danger' : 'primary'}
          onClick={togglePump}
          style={{ marginRight: '1rem' }}
          icon={isPumpActive ? <StopOutlined /> : <ToolOutlined />}
        >
          {isPumpActive ? 'Stop Grip' : 'Start Grip'}
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Button
          type="default"
          icon={<SwapOutlined />}
          onClick={handleModeChange}
        >
          Change to {controlMode === 'sliders' ? 'Buttons' : controlMode === 'buttons' ? 'Gamepad' : 'Sliders'}
        </Button>
      </div>
    </div>
  );
};

export default RobotArmControl;

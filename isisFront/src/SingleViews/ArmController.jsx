import React, { useState } from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import RobotArmControl from '../components/RobotArm';
import CameraFeed2 from '../components/Camera2/index';
import GamepadFront from '../components/gamepad/GamepadFront';
import GamepadUpside from '../components/gamepad/GamepadUpside';
import placeholderImage from './joints.png'; 
import './RobotArmControlView.css';

const RobotArmControlView = () => {
  const [controlMode, setControlMode] = useState('sliders'); // Estado del modo de control

  return (
    <div className="robot-arm-control-view">
      {/* Navbar */}
      <Nav />

      {/* Contenido principal */}
      <Row gutter={[16, 16]} className="content-row" justify="center">
        {/* Columna izquierda */}
        <Col xs={24} sm={24} md={8} lg={6} className="camera-col">
          <CameraFeed2 />
        </Col>

        {/* Columna central */}
        <Col xs={24} sm={24} md={8} lg={12} className="control-column">
          <RobotArmControl setControlMode={setControlMode} controlMode={controlMode} />
        </Col>

        {/* Columna derecha */}
        <Col xs={24} sm={24} md={8} lg={6} className="control-column">
          {controlMode === 'gamepad' ? (
            <>
              <GamepadFront />
              <GamepadUpside />
            </>
          ) : (
            <img
              src={placeholderImage}
              alt="Placeholder content"
              style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RobotArmControlView;

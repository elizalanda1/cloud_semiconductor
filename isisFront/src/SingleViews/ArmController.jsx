// src/views/RobotArmControlView.jsx

import React from 'react';
import { Row, Col } from 'antd';
import Nav from '../components/Nav';
import EmergencyButton from '../components/EmergencyButton';
import RobotArmControl from '../components/RobotArm';
import './RobotArmControlView.css';

const RobotArmControlView = () => {
  return (
    <div className="robot-arm-control-view">
      {/* Navbar */}
      <Nav />

      {/* Contenido principal */}
      <Row gutter={[16, 16]} className="content-row" justify="center">
        <Col xs={24} sm={24} md={12} lg={8} className="control-column">
          {/* Botón de emergencia */}
          {/*<EmergencyButton />*/}
          
          {/* Control del brazo robótico */}
          <RobotArmControl />
        </Col>
      </Row>
    </div>
  );
};

export default RobotArmControlView;

import React from 'react';
import { Button } from 'antd';
import { emergencyStop } from '../../services/Flask';
import './index.css';

const EmergencyButton = () => {
  const handleEmergencyStop = async () => {
    try {
      await emergencyStop();
      console.log("Paro de emergencia activado");
    } catch (error) {
      console.error("Error al activar el paro de emergencia:", error);
    }
  };

  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      danger
      onClick={handleEmergencyStop}
      className="emergency-button"
    >
      Emergency Stop
    </Button>
  );
};

export default EmergencyButton;

import React from 'react';
import { Button } from 'antd';
import { stopMoveArm2 } from '../../services/slackService'; // Asegúrate de que la ruta sea correcta
import './index.css';

const StopMoveArm2Button = () => {
  const handleStopMoveArm2 = async () => {
    try {
      await stopMoveArm2();
      console.log("Movimiento del brazo detenido.");
    } catch (error) {
      console.error("Error al detener el movimiento del brazo:", error);
    }
  };

  return (
    <Button
      type="default"
      shape="round"
      size="large"
      danger
      onClick={handleStopMoveArm2}
      className="stop-move-arm-button"
    >
      Detener Movimiento
    </Button>
  );
};

export default StopMoveArm2Button;

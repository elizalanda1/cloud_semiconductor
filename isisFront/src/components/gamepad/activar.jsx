import React from 'react';
import { Button } from 'antd';
import { moveArm2 } from '../../services/slackService'; // Asegúrate de que la ruta sea correcta
import './index.css';

const MoveArm2Button = () => {
  const handleMoveArm2 = async () => {
    try {
      await moveArm2();
      console.log("Movimiento del brazo activado.");
    } catch (error) {
      console.error("Error al activar el movimiento del brazo:", error);
    }
  };

  return (
    <Button
      type="primary"
      shape="round"
      size="large"
      onClick={handleMoveArm2}
      className="move-arm-button"
    >
      Activar Movimiento
    </Button>
  );
};

export default MoveArm2Button;

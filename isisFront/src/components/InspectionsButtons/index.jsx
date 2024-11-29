import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import {
  startWalkGood,
  startWalkDefective,
  startContinuousClassification,
  stopContinuousClassification,
} from '../../services/Flask';
import { addCircuit } from '../../services/Api';
import './index.css';

const InspectionButtons = () => {
  const [circuitName, setCircuitName] = useState(''); // Estado para el texto del input
  const [isAutomaticMode, setIsAutomaticMode] = useState(false); // Estado para el modo automático
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false); // Estado para deshabilitar todos los botones

  const handleInputChange = (e) => {
    setCircuitName(e.target.value); // Actualiza el estado con el valor del input
  };

  const handleGoodClick = async () => {
    if (!circuitName.trim()) {
      message.error('El nombre del circuito es obligatorio.');
      return;
    }

    setIsButtonsDisabled(true); // Deshabilita todos los botones
    setTimeout(() => setIsButtonsDisabled(false), 6000); // Rehabilita los botones después de 6 segundos

    try {
      await startWalkGood();
      message.success('Movimiento hacia posición "Good" iniciado.');

      await addCircuit({
        name: circuitName,
        imageUrl: 'https://example.com/circuitoa.jpg',
        inspectionResult: 'Good',
      });
      message.success('Circuito añadido exitosamente en posición Good.');
    } catch (error) {
      console.error('Error en el proceso "Good":', error);
      message.error('Hubo un error al procesar la posición Good.');
    }
  };

  const handleDefectiveClick = async () => {
    if (!circuitName.trim()) {
      message.error('El nombre del circuito es obligatorio.');
      return;
    }

    setIsButtonsDisabled(true); // Deshabilita todos los botones
    setTimeout(() => setIsButtonsDisabled(false), 15000); // Rehabilita los botones después de 6 segundos

    try {
      await startWalkDefective();
      message.success('Movimiento hacia posición "Defective" iniciado.');

      await addCircuit({
        name: circuitName,
        imageUrl: 'https://example.com/circuitoa.jpg',
        inspectionResult: 'Defective',
      });
      message.success('Circuito añadido exitosamente en posición Defective.');
    } catch (error) {
      console.error('Error en el proceso "Defective":', error);
      message.error('Hubo un error al procesar la posición Defective.');
    }
  };

  const handleAutomaticModeClick = async () => {
    setIsAutomaticMode(true); // Cambia al modo automático inmediatamente
    setIsButtonsDisabled(true); // Deshabilita todos los botones
    try {
      await startContinuousClassification();
      message.success('Modo automático iniciado.');
    } catch (error) {
      console.error('Error al iniciar el modo automático:', error);
      message.error('Hubo un error al iniciar el modo automático.');
      setIsButtonsDisabled(false); // Rehabilita los botones si hay un error
    }
  };

  const handleManualModeClick = async () => {
    setIsAutomaticMode(false); // Cambia al modo manual inmediatamente
    setIsButtonsDisabled(true); // Deshabilita todos los botones
    try {
      await stopContinuousClassification();
      message.success('Modo manual activado.');
      setIsButtonsDisabled(false); // Rehabilita los botones
    } catch (error) {
      console.error('Error al detener el modo automático:', error);
      message.error('Hubo un error al detener el modo automático.');
      setIsButtonsDisabled(false); // Rehabilita los botones incluso si hay un error
    }
  };

  return (
    <div className="inspection-buttons-container">
      {isAutomaticMode ? (
        // Modo Automático: Mostrar solo botón "Modo Manual"
        <Button
          className="inspection-button manual"
          onClick={handleManualModeClick}
          disabled={isButtonsDisabled} // Deshabilita el botón si todos están deshabilitados
        >
          Modo Manual
        </Button>
      ) : (
        // Modo Manual: Mostrar input, botones "Good", "Defective" y "Modo Automático"
        <>
          <Input
            placeholder="Ingresa el nombre del circuito"
            value={circuitName}
            onChange={handleInputChange}
            className="circuit-name-input"
            disabled={isButtonsDisabled} // Deshabilita el input si todos los botones están deshabilitados
          />

          <Button
            className="inspection-button good"
            onClick={handleGoodClick}
            disabled={isButtonsDisabled} // Deshabilita el botón si todos están deshabilitados
          >
            Good
          </Button>

          <Button
            className="inspection-button defective"
            onClick={handleDefectiveClick}
            disabled={isButtonsDisabled} // Deshabilita el botón si todos están deshabilitados
          >
            Defective
          </Button>

          <Button
            className="inspection-button automatic"
            onClick={handleAutomaticModeClick}
            disabled={isButtonsDisabled} // Deshabilita el botón si todos están deshabilitados
          >
            Modo Automático
          </Button>
        </>
      )}
    </div>
  );
};

export default InspectionButtons;

import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { startWalkGood, startWalkDefective } from '../../services/Flask';
import { addCircuit } from '../../services/Api';
import './index.css';

const InspectionButtons = () => {
  const [circuitName, setCircuitName] = useState(''); // Estado para el texto del input

  const handleInputChange = (e) => {
    setCircuitName(e.target.value); // Actualiza el estado con el valor del input
  };

  const handleGoodClick = async () => {
    if (!circuitName.trim()) {
      message.error('El nombre del circuito es obligatorio.');
      return;
    }
    try {
      // Llamada al servicio Flask
      await startWalkGood();
      console.log("Movimiento hacia posición 'Good' iniciado");

      // Llamada al servicio addCircuit
      const response = await addCircuit({
        name: circuitName,
        imageUrl: "https://example.com/circuitoa.jpg",
        inspectionResult: "Good",
      });
      console.log('Circuito añadido (Good):', response);

      message.success('Circuito añadido exitosamente en posición Good.');
    } catch (error) {
      console.error("Error al procesar 'Good':", error);
      message.error('Hubo un error al añadir el circuito (Good).');
    }
  };

  const handleDefectiveClick = async () => {
    if (!circuitName.trim()) {
      message.error('El nombre del circuito es obligatorio.');
      return;
    }
    try {
      // Llamada al servicio Flask
      await startWalkDefective();
      console.log("Movimiento hacia posición 'Defective' iniciado");

      // Llamada al servicio addCircuit
      const response = await addCircuit({
        name: circuitName,
        imageUrl: "https://example.com/circuitoa.jpg",
        inspectionResult: "Defective",
      });
      console.log('Circuito añadido (Defective):', response);

      message.success('Circuito añadido exitosamente en posición Defective.');
    } catch (error) {
      console.error("Error al procesar 'Defective':", error);
      message.error('Hubo un error al añadir el circuito (Defective).');
    }
  };

  return (
    <div className="inspection-buttons-container">
      {/* Input para el nombre del circuito */}
      <Input
        placeholder="Ingresa el nombre del circuito"
        value={circuitName}
        onChange={handleInputChange}
        className="circuit-name-input"
      />

      {/* Botón para la posición 'Good' */}
      <Button
        className="inspection-button good"
        onClick={handleGoodClick}
      >
        Good
      </Button>

      {/* Botón para la posición 'Defective' */}
      <Button
        className="inspection-button defective"
        onClick={handleDefectiveClick}
      >
        Defective
      </Button>
    </div>
  );
};

export default InspectionButtons;

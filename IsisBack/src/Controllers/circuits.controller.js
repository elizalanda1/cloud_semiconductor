import Circuit from '../models/Circuits.js';

import { updateInventoryAfterInspection } from './inventory.controller.js';

export const createCircuit = async (req, res) => {
  try {
    const { name, imageUrl, inspectionResult} = req.body;

    const newCircuit = new Circuit({
      name,
      imageUrl,
      inspectionResult
    });

    const savedCircuit = await newCircuit.save();

    // Actualizar el inventario basado en el nombre del circuito y el resultado de la inspección
    await updateInventoryAfterInspection(name, inspectionResult);

    res.status(201).json(savedCircuit);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el circuito', error });
  }
};


export const getCircuits = async (req, res) => {
    try {
      const circuits = await Circuit.find();
      res.status(200).json(circuits);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los circuitos', error });
    }
  };
  
  export const getCircuitById = async (req, res) => {
    try {
      const { id } = req.params;
      const circuit = await Circuit.findById(id);
      if (!circuit) return res.status(404).json({ message: 'Circuito no encontrado' });
      res.status(200).json(circuit);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el circuito', error });
    }
  };
  
  export const updateCircuit = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCircuit = await Circuit.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCircuit) return res.status(404).json({ message: 'Circuito no encontrado' });
      res.status(200).json(updatedCircuit);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el circuito', error });
    }
  };
  
  export const deleteCircuit = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCircuit = await Circuit.findByIdAndDelete(id);
      if (!deletedCircuit) return res.status(404).json({ message: 'Circuito no encontrado' });
      res.status(200).json({ message: 'Circuito eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el circuito', error });
    }
  };
  
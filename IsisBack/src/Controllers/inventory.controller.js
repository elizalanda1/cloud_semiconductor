import Inventory from "../models/Inventory.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();  // Obtén todos los elementos de inventario
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inventario', error });
  }
};

export const updateInventoryName = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del elemento de inventario desde los parámetros de la solicitud
    const { newName } = req.body; // Obtener el nuevo nombre desde el cuerpo de la solicitud

    // Validar que se proporcione un nuevo nombre
    if (!newName) {
      return res.status(400).json({ message: 'El nuevo nombre es obligatorio' });
    }

    // Buscar el elemento en el inventario y actualizar su nombre
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id, 
      { name: newName }, // Actualizar el campo 'name'
      { new: true } // Devolver el documento actualizado
    );

    // Validar si se encontró el elemento
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Elemento de inventario no encontrado' });
    }

    res.status(200).json({ message: 'Nombre actualizado correctamente', updatedInventory });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el nombre del elemento de inventario', error });
  }
};



export const updateInventoryAfterInspection = async (circuitName, inspectionResult) => {
  try {
    // Buscar en el inventario por el nombre del circuito
    let inventoryItem = await Inventory.findOne({ name: circuitName });

    // Si no existe un inventario para este nombre, crear uno
    if (!inventoryItem) {
      inventoryItem = new Inventory({
        name: circuitName,
        totalQuantity: 0,
        goodQuantity: 0,
        defectiveQuantity: 0
      });
    }

    // Actualizar las cantidades basadas en el resultado de la inspección
    inventoryItem.totalQuantity += 1;
    if (inspectionResult === 'Good') {
      inventoryItem.goodQuantity += 1;
    } else {
      inventoryItem.defectiveQuantity += 1;
    }

    // Guardar el inventario actualizado
    await inventoryItem.save();
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
  }
};
  
  export const deleteInventory = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedInventory = await Inventory.findByIdAndDelete(id);
      if (!deletedInventory) return res.status(404).json({ message: 'Elemento de inventario no encontrado' });
      res.status(200).json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el elemento de inventario', error });
    }
  };
  
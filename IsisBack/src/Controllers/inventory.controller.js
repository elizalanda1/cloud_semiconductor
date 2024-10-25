import Inventory from "../models/Inventory.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();  // Obtén todos los elementos de inventario
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inventario', error });
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
  
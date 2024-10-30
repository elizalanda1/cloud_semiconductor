import Report from "../models/Reports.js";
import Inventory from "../models/Inventory.js";

// Obtener el reporte actual
export const getReport = async (req, res) => {
  try {
    const report = await Report.findOne();
    if (!report) return res.status(404).json({ message: 'No hay reportes disponibles' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el reporte', error });
  }
};

// Actualizar el reporte según el inventario actual
export const updateReport = async (req, res) => {
  try {
    // Obtener los datos de inventario
    const inventoryItems = await Inventory.find();

    // Calcular totales
    let totalInspected = 0;
    let totalGood = 0;
    let totalDefective = 0;

    inventoryItems.forEach(item => {
      totalInspected += item.totalQuantity;
      totalGood += item.goodQuantity;
      totalDefective += item.defectiveQuantity;
    });

    // Buscar y actualizar el reporte existente o crear uno nuevo
    const updatedReport = await Report.findOneAndUpdate(
      {},
      { totalInspected, totalGood, totalDefective },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el reporte', error });
  }
};

// Reiniciar el reporte (borrar los datos actuales)
export const resetReport = async (req, res) => {
  try {
    // Eliminar el reporte actual
    await Report.deleteMany();
    res.status(200).json({ message: 'Reporte reiniciado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al reiniciar el reporte', error });
  }
};

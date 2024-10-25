import Report from "../models/Reports.js";

export const createReport = async (req, res) => {
  try {
    const { totalInspected, totalGood, totalDefective, generatedBy } = req.body;
    
    const newReport = new Report({
      totalInspected,
      totalGood,
      totalDefective,
      generatedBy
    });
    
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el reporte', error });
  }
};

export const getReports = async (req, res) => {
    try {
      const reports = await Report.find().populate('generatedBy');
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
  };


export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el reporte', error });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el reporte', error });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) return res.status(404).json({ message: 'Reporte no encontrado' });
    res.status(200).json({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el reporte', error });
  }
};

import { Router } from 'express';
import * as reportCtrl from '../Controllers/reports.controller.js';

const router = Router();

// Obtener todos los reportes
router.get('/', reportCtrl.getReports);


// Crear un nuevo reporte
router.post('/', reportCtrl.createReport);


// Obtener un reporte por ID
router.get('/:id', reportCtrl.getReportById);

// Actualizar un reporte por ID
router.put('/:id', reportCtrl.updateReport);

// Eliminar un reporte por ID
router.delete('/:id', reportCtrl.deleteReport);


export default router;

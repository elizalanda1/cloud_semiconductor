import { Router } from 'express';
import * as reportCtrl from '../Controllers/reports.controller.js';

const router = Router();

// Obtener reporte
router.get('/', reportCtrl.getReport);


// actualizar reporte
router.get('/update', reportCtrl.updateReport);


// resetear reporte
router.get('/:id', reportCtrl.resetReport);


export default router;

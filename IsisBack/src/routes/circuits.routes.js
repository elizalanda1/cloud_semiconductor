import {Router} from "express";
const router = Router();

import * as circuitCtrl from '../Controllers/circuits.controller.js';

//in this code we can use this routes to some specific action whit the circuits that are being analized
// get all the circuits
router.get('/', circuitCtrl.getCircuits);
// get circuit
router.get('/:id', circuitCtrl.getCircuitById);
// new circuit
router.post('/', circuitCtrl.createCircuit);
// update circuit
router.put('/:id', circuitCtrl.updateCircuit);
// delete circuit
router.delete('/:id', circuitCtrl.deleteCircuit);

export default router;
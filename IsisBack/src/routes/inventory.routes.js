import { Router } from 'express';
const router = Router();

import * as inventoryctrl from "../Controllers/inventory.controller.js";

// getinventary
router.get('/', inventoryctrl.getInventory);

// drop inventory
router.delete('/:id', inventoryctrl.deleteInventory);

//re name 
router.put('/:id', inventoryctrl.updateInventoryName)

export default router;
import { Router } from 'express';
const router = Router();

import * as inventoryctrl from "../Controllers/inventory.controller.js";

// getinventary
router.get('/', inventoryctrl.getInventory);

// dro inventory
router.delete('/:id', inventoryctrl.deleteInventory);

export default router;
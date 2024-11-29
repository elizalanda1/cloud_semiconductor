import { Router } from 'express';
const router = Router();

// Login Route
router.post('/login', loginUser);
// Register Route
router.post('/register', registerUser);

export default router;
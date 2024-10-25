import { Router } from 'express';
import * as userCtrl from '../Controllers/user.controller.js';

const router = Router();

// Registrar un nuevo usuario
router.post('/register', userCtrl.registerUser);

// sign in
router.get('/', userCtrl.loginUser);



export default router;

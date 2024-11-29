import { Router } from 'express';
import * as userCtrl from '../Controllers/user.controller.js';

const router = Router();

// Registrar un nuevo usuario
router.post('/register', userCtrl.registerUser);

// Iniciar sesión
router.post('/login', userCtrl.loginUser);

// Obtener información de un usuario por ID
router.get('/:id', userCtrl.getUserById);

// Actualizar información de un usuario por ID
router.put('/:id', userCtrl.updateUser);

export default router;

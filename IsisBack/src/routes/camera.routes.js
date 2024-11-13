// routes/camera.routes.js

import express from 'express';
import { streamVideo } from "../Controllers/camera.controller.js";

const router = express.Router();

// Ruta para transmitir video
router.get('/video', streamVideo);

export default router;

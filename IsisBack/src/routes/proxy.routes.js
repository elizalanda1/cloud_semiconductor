import { Router } from 'express';
import axios from 'axios';

const router = Router();
const FLASK_SERVER_URL = 'http://14.10.2.192:8079';

router.post('/startwalk_good', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_SERVER_URL}/startwalk_good`);
        res.json(response.data);
    } catch (error) {
        console.error("Error en '/startwalk_good':", error.message);
        res.status(500).json({ error: 'Error al iniciar movimiento "Good"' });
    }
});

router.post('/startwalk_defective', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_SERVER_URL}/startwalk_defective`);
        res.json(response.data);
    } catch (error) {
        console.error("Error en '/startwalk_defective':", error.message);
        res.status(500).json({ error: 'Error al iniciar movimiento "Defective"' });
    }
});

router.post('/emergency_stop', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_SERVER_URL}/emergency_stop`);
        res.json(response.data);
    } catch (error) {
        console.error("Error en '/emergency_stop':", error.message);
        res.status(500).json({ error: 'Error al activar el paro de emergencia' });
    }
});

router.get('/video_feed', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_SERVER_URL}/video_feed`, {
            responseType: 'stream',
        });

        // Configurar el encabezado para indicar que es un flujo de video
        res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

        // Pipea el flujo desde el servidor Flask hacia el cliente
        response.data.pipe(res);
    } catch (error) {
        console.error("Error en '/video_feed':", error.message);
        res.status(500).send('Error al obtener el flujo de video');
    }
});


router.post('/move_arm', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_SERVER_URL}/move_arm`, req.body, {
            headers: { 'Content-Type': 'application/json' },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error en '/move_arm':", error.message);
        res.status(500).json({ error: 'Error al mover el brazo robótico' });
    }
});

export default router;

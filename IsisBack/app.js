import express from 'express';
import cors from 'cors';
import circuitRoutes from "./src/routes/circuits.routes.js";
import usersRoutes from "./src/routes/user.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";
import reportroutes from "./src/routes/reports.routes.js";



const app = express();

app.use(express.json());
app.use(cors()); // Permite solicitudes desde cualquier origen

// Ruta inicial
app.get(`/`, (req, res) => {
    res.send(`Isis Emfutech 2024 JAAC`)
});

// Rutas
app.use(`/api/circuits`, circuitRoutes);
app.use(`/api/user`, usersRoutes);
app.use(`/api/inventory`, inventoryRoutes);
app.use(`/api/report`, reportroutes);

export default app;

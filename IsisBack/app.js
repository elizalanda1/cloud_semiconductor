import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*', // Permitir todos los orígenes temporalmente
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));



// Maneja solicitudes preflight
app.options('*', cors());



app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).send('Isis Emfutech 2024 JAAC');
});

// Importa y usa rutas
import circuitRoutes from "./src/routes/circuits.routes.js";
import usersRoutes from "./src/routes/user.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";
import reportRoutes from "./src/routes/reports.routes.js";
import proxyRoutes from "./src/routes/proxy.routes.js"

app.use('/api/circuits', circuitRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/report', reportRoutes);
app.use('/proxy', proxyRoutes);

export default app;

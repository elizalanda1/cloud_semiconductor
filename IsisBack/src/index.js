import app from '../app.js'; // Usa './app.js' en lugar de '../app.js' si el archivo está en el mismo nivel
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8068;
const host = '0.0.0.0'; // Configura el host para aceptar conexiones externas

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch(error => console.error('Database connection error:', error));

// Escucha en el puerto configurado y en el host 0.0.0.0
app.listen(port, host, () => {
    console.log(`Servidor escuchando en el puerto ${port} en el host ${host}`);
});

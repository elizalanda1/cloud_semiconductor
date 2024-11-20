import app from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as authJwt from './middlewares/authJwt.js';

export { authJwt };

dotenv.config();
app.listen(3000);

//connection
mongoose.connect(process.env.MONGODB_URI).then(
    ()=>console.log(`Database Conected`)
).catch((error) => console.error(error))

console.log(`servidor escuchando en el puerto`, 3000);
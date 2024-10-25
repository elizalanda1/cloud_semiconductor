import express from 'express';
import circuitRoutes from "./src/routes/circuits.routes.js"
import usersRoutes from "./src/routes/user.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";
import reportroutes from "./src/routes/reports.routes.js";

const app = express();
app.use(express.json());

//nitial route
app.get(`/`, (req,res) => {
    res.send(`Isis Emfutech 2024 JAAC`)
})

//Routes
app.use(`/api/circuits`,circuitRoutes);
app.use(`/api/user`,usersRoutes);
app.use(`/api/inventory`,inventoryRoutes);
app.use(`/api/report`,reportroutes);



export default app;
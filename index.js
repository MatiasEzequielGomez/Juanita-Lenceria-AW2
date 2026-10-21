import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productosRouter from './routes/productos.routes.js'
import usuariosRouter from './routes/usuarios.routes.js'
import ventasRouter from './routes/ventas.routes.js'
import logger from "./middlewares/logger.middleware.js";
dotenv.config()

const app= express()

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/productos', productosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/ventas', ventasRouter)

app.listen(PORT, () =>{
    console.log(`Servidor levantado en puerto ${PORT}`)
})
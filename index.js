import express from "express";
import dotenv from "dotenv";

import productosRouter from './routes/productos.routes.js'
import usuariosRouter from './routes/usuarios.routes.js'
import ventasRouter from './routes/ventas.routes.js'


dotenv.config()

const app= express()

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/productos', productosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/ventas', ventasRouter)

app.listen(PORT, () =>{
    console.log(`Servidor levantado en puerto ${PORT}`)
})
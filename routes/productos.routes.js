import { Router } from "express";

import {
  obtenerProductos,
  crearProducto,
  modificarPrecioProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener productos
router.get("/", obtenerProductos);

// Agregar producto
router.post("/", verificarToken, crearProducto);

// Modificar precio de producto
router.put(
  "/:id/precio",
  verificarToken,
  modificarPrecioProducto,
);

// Eliminar producto
router.delete(
  "/:id",
  verificarToken,
  eliminarProducto,
);

export default router;
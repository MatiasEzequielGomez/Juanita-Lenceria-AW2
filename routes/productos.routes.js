import { Router } from "express";

import {
  obtenerProductos,
  crearProducto,
  modificarPrecioProducto,
  eliminarProducto
} from "../controllers/productos.controller.js";

const router = Router();

// Obtener productos
router.get("/", obtenerProductos);

// Agregar producto
router.post("/", crearProducto);

// Modificar precio de producto
router.put("/:id/precio", modificarPrecioProducto);

// Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;
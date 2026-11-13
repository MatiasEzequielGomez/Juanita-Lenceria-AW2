import { Router } from "express";

import {
  obtenerVentasPorFecha,
  obtenerVentasPorUsuario,
  crearVenta,
} from "../controllers/ventas.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener ventas por rango de fechas
router.get("/", obtenerVentasPorFecha);

// Obtener ventas por ID de usuario
router.get("/usuario/:id", obtenerVentasPorUsuario);

// Crear venta
router.post("/", verificarToken, crearVenta);

export default router;
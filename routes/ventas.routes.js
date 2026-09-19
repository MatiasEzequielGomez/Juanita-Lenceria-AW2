import { Router } from "express";

import {
  obtenerVentasPorFecha,
  obtenerVentasPorUsuario
} from "../controllers/ventas.controller.js";

const router = Router();

// Obtener ventas por rango de fechas
router.get("/", obtenerVentasPorFecha);

// Obtener ventas por ID de usuario
router.get("/usuario/:id", obtenerVentasPorUsuario);

export default router;
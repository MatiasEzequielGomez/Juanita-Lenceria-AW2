import { Router } from "express";

import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", obtenerUsuarios);

// Obtener usuario por ID
router.get("/:id", obtenerUsuarioPorId);

// Agregar usuario
router.post("/", crearUsuario);

// Modificar estado del usuario
router.put("/:id/estado", cambiarEstadoUsuario);

// Eliminar usuario
router.delete("/:id", eliminarUsuario);

export default router;
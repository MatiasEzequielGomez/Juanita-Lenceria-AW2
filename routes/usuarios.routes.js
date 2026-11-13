import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import {
  login,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";

const router = Router();

// Login
router.post("/login", login);

// Obtener todos los usuarios
router.get("/", obtenerUsuarios);

// Obtener usuario por ID
router.get("/:id", obtenerUsuarioPorId);

// Agregar usuario
router.post("/", crearUsuario);

router.put(
  "/:id/estado",
  verificarToken,
  cambiarEstadoUsuario,
);

// Eliminar usuario
router.delete(
  "/:id",
  verificarToken,
  eliminarUsuario,
);

export default router;
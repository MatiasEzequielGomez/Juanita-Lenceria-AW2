import {
  getUsuarios,
  getUsuarioById,
  addUsuario,
  modificarEstadoUsuario,
  deleteUsuario
} from "../services/usuarios.services.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los usuarios"
    });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const usuario = await getUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({
        error: "No se encontró el usuario"
      });
    }

    res.status(200).json(usuario);

  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el usuario"
    });
  }
};

// Agregar usuario
export const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await addUsuario(req.body);

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar usuario"
    });
  }
};

// Modificar estado del usuario
export const cambiarEstadoUsuario = async (req, res) => {
  const id = parseInt(req.params.id);
  const activo = req.body.activo;

  try {
    const usuario = await modificarEstadoUsuario(id, activo);

    if (!usuario) {
      return res.status(404).json({
        error: "No se encontró el usuario"
      });
    }

    res.status(200).json({
      mensaje: "Estado del usuario modificado",
      usuario
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al modificar el estado del usuario"
    });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const resultado = await deleteUsuario(id);

    if (resultado === "TIENE_VENTAS") {
      return res.status(400).json({
        error: "No se puede eliminar porque tiene ventas asociadas"
      });
    }

    if (!resultado) {
      return res.status(404).json({
        error: "No se encontró el usuario"
      });
    }

    res.status(200).json({
      mensaje: "Usuario eliminado",
      usuario: resultado
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar usuario"
    });
  }
};
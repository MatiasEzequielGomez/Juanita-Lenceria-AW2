import Usuario from "../models/usuario.model.js";
import Venta from "../models/venta.model.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export const getUsuarios = async () => {
  return await Usuario.find().select("-contraseña");
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  return await Usuario.findById(id).select("-contraseña");
};

// Agregar usuario
export const addUsuario = async (nuevoUsuario) => {
  const emailIngresado = nuevoUsuario.email.trim().toLowerCase();
  const telefonoIngresado = nuevoUsuario.telefono.trim();

  const telefonoValido = /^[0-9]{8,15}$/.test(telefonoIngresado);

  if (!telefonoValido) {
    return "TELEFONO_INVALIDO";
  }

  const emailExistente = await Usuario.findOne({
    email: emailIngresado,
  });

  if (emailExistente) {
    return "EMAIL_EXISTENTE";
  }
  const contraseñaHasheada = await bcrypt.hash(nuevoUsuario.contraseña, 10);
  const usuarioCreado = await Usuario.create({
    nombre: nuevoUsuario.nombre,
    apellido: nuevoUsuario.apellido,
    email: emailIngresado,
    telefono: telefonoIngresado,
    contraseña: contraseñaHasheada,
    activo: true,
  });

  const usuario = usuarioCreado.toObject();

  delete usuario.contraseña;

  return usuario;
};

// Modificar estado del usuario
export const modificarEstadoUsuario = async (id, activo) => {
  return await Usuario.findByIdAndUpdate(
    id,
    { activo },
    {
      new: true,
      runValidators: true,
    },
  ).select("-contraseña");
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    return null;
  }

  const tieneVentas = await Venta.exists({
    id_usuario: id,
  });

  if (tieneVentas) {
    return "TIENE_VENTAS";
  }

  const usuarioEliminado = await Usuario.findByIdAndDelete(id);

  const usuarioSinContraseña = usuarioEliminado.toObject();

  delete usuarioSinContraseña.contraseña;

  return usuarioSinContraseña;
};

// Login
export const loginUsuario = async (email, contraseña) => {
  const usuario = await Usuario.findOne({
    email: email.trim().toLowerCase(),
    activo: true,
  });

  if (!usuario) {
    return null;
  }

  const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

  if (!contraseñaValida) {
    return null;
  }

  const usuarioSinContraseña = usuario.toObject();

  delete usuarioSinContraseña.contraseña;

  return usuarioSinContraseña;
};

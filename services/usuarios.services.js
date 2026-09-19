import { readFile, writeFile } from "fs/promises";

const rutaUsuarios = "./data/usuarios.json";
const rutaVentas = "./data/ventas.json";

// Leer usuarios
const leerUsuarios = async () => {
  const archivo = await readFile(rutaUsuarios, "utf-8");
  return JSON.parse(archivo);
};

// Guardar usuarios
const guardarUsuarios = async (usuarios) => {
  await writeFile(
    rutaUsuarios,
    JSON.stringify(usuarios, null, 2)
  );
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
  return await leerUsuarios();
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  const usuarios = await leerUsuarios();

  return usuarios.find(usuario => usuario.id === id);
};

// Agregar usuario
export const addUsuario = async (nuevoUsuario) => {
  const usuarios = await leerUsuarios();

  const nuevoId =
    usuarios.length > 0
      ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
      : 1;

  const usuario = {
    id: nuevoId,
    nombre: nuevoUsuario.nombre,
    apellido: nuevoUsuario.apellido,
    email: nuevoUsuario.email,
    telefono: nuevoUsuario.telefono,
    contraseña: nuevoUsuario.contraseña,
    activo: true
  };

  usuarios.push(usuario);

  await guardarUsuarios(usuarios);

  return usuario;
};

// Modificar estado del usuario
export const modificarEstadoUsuario = async (id, activo) => {
  const usuarios = await leerUsuarios();

  const usuario = usuarios.find(usuario => usuario.id === id);

  if (!usuario) {
    return null;
  }

  usuario.activo = activo;

  await guardarUsuarios(usuarios);

  return usuario;
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  const usuarios = await leerUsuarios();

  const index = usuarios.findIndex(usuario => usuario.id === id);

  if (index === -1) {
    return null;
  }

  const archivoVentas = await readFile(rutaVentas, "utf-8");
  const ventas = JSON.parse(archivoVentas);

  const tieneVentas = ventas.some(venta => venta.id_usuario === id);

  if (tieneVentas) {
    return "TIENE_VENTAS";
  }

  const [usuarioEliminado] = usuarios.splice(index, 1);

  await guardarUsuarios(usuarios);

  return usuarioEliminado;
};
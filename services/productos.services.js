import { readFile, writeFile } from "fs/promises";

const rutaProductos = "./data/productos.json";
const rutaVentas = "./data/ventas.json";

// Leer productos
const leerProductos = async () => {
  const archivo = await readFile(rutaProductos, "utf-8");
  return JSON.parse(archivo);
};

// Guardar productos
const guardarProductos = async (productos) => {
  await writeFile(
    rutaProductos,
    JSON.stringify(productos, null, 2)
  );
};

// Obtener todos los productos
export const getProductos = async () => {
    const productos = await leerProductos();

    return productos;
};

// Agregar producto
export const addProducto = async (nuevoProducto) => {
  const productos = await leerProductos();

  const nuevoId =
    productos.length > 0
      ? Math.max(...productos.map(producto => producto.id)) + 1
      : 1;

  const producto = {
    id: nuevoId,
    nombre: nuevoProducto.nombre,
    descripcion: nuevoProducto.descripcion,
    categoria: nuevoProducto.categoria,
    precio: nuevoProducto.precio,
    stock: nuevoProducto.stock,
    imagen: nuevoProducto.imagen,
    disponible: nuevoProducto.disponible
  };

  productos.push(producto);

  await guardarProductos(productos);

  return producto;
};

// Modificar precio
export const updatePrecioProducto = async (id, nuevoPrecio) => {
  const productos = await leerProductos();

  const producto = productos.find(producto => producto.id === id);

  if (!producto) {
    return null;
  }

  producto.precio = nuevoPrecio;

  await guardarProductos(productos);

  return producto;
};

// Eliminar producto
export const deleteProducto = async (id) => {
  const productos = await leerProductos();

  const index = productos.findIndex(producto => producto.id === id);

  if (index === -1) {
    return null;
  }

  const archivoVentas = await readFile(rutaVentas, "utf-8");
  const ventas = JSON.parse(archivoVentas);

  const tieneVentas = ventas.some(venta =>
    venta.productos.some(producto => producto.id_producto === id)
  );

  if (tieneVentas) {
    return "TIENE_VENTAS";
  }

  const [productoEliminado] = productos.splice(index, 1);

  await guardarProductos(productos);

  return productoEliminado;
};
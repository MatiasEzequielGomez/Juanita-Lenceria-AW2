import Producto from "../models/producto.model.js";
import Venta from "../models/venta.model.js";

// Obtener todos los productos
export const getProductos = async () => {
  return await Producto.find();
};

// Agregar producto
export const addProducto = async (nuevoProducto) => {
  const producto = await Producto.create({
    nombre: nuevoProducto.nombre,
    descripcion: nuevoProducto.descripcion,
    categoria: nuevoProducto.categoria,
    subcategoria: nuevoProducto.subcategoria,
    precio: nuevoProducto.precio,
    stock: nuevoProducto.stock,
    imagen: nuevoProducto.imagen,
    disponible: nuevoProducto.disponible,
  });

  return producto;
};

// Modificar precio
export const updatePrecioProducto = async (id, nuevoPrecio) => {
  return await Producto.findByIdAndUpdate(
    id,
    { precio: nuevoPrecio },
    {
      new: true,
      runValidators: true,
    },
  );
};

// Eliminar producto
export const deleteProducto = async (id) => {
  const producto = await Producto.findById(id);

  if (!producto) {
    return null;
  }

  const tieneVentas = await Venta.exists({
    "productos.id_producto": id,
  });

  if (tieneVentas) {
    return "TIENE_VENTAS";
  }

  return await Producto.findByIdAndDelete(id);
};
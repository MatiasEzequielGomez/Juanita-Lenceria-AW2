import Venta from "../models/venta.model.js";
import Producto from "../models/producto.model.js";
import Usuario from "../models/usuario.model.js";

// Obtener ventas por rango de fechas
export const getVentasByFecha = async (from, to) => {
  const desde = new Date(`${from}T00:00:00.000Z`);
  const hasta = new Date(`${to}T23:59:59.999Z`);

  return await Venta.find({
    fecha: {
      $gte: desde,
      $lte: hasta,
    },
  })
    .populate("id_usuario", "nombre apellido email")
    .populate(
      "productos.id_producto",
      "nombre precio categoria subcategoria",
    );
};

// Obtener ventas por ID de usuario
export const getVentasByUsuarioId = async (id) => {
  return await Venta.find({
    id_usuario: id,
  })
    .populate("id_usuario", "nombre apellido email")
    .populate(
      "productos.id_producto",
      "nombre precio categoria subcategoria",
    );
};

// Agregar venta
export const addVenta = async (nuevaVenta) => {
  const usuario = await Usuario.findOne({
    _id: nuevaVenta.id_usuario,
    activo: true,
  });

  if (!usuario) {
    return "USUARIO_INVALIDO";
  }

  const productosVenta = [];
  const productosActualizar = [];

  for (const item of nuevaVenta.productos) {
    const producto = await Producto.findById(item.id_producto);

    if (!producto) {
      return "PRODUCTO_INVALIDO";
    }

    if (
      !producto.disponible ||
      item.cantidad <= 0 ||
      item.cantidad > producto.stock
    ) {
      return "STOCK_INSUFICIENTE";
    }

    productosVenta.push({
      id_producto: producto._id,
      cantidad: item.cantidad,
      precio_unitario: producto.precio,
    });

    productosActualizar.push({
      producto,
      cantidad: item.cantidad,
    });
  }

  const subtotal = productosVenta.reduce(
    (total, item) =>
      total + item.precio_unitario * item.cantidad,
    0,
  );

  const venta = await Venta.create({
    id_usuario: usuario._id,
    direccion: nuevaVenta.direccion,
    productos: productosVenta,
    subtotal,
    descuento: false,
    importe_descuento: 0,
    total: subtotal,
  });

  // Actualizar stock de los productos
  for (const item of productosActualizar) {
    item.producto.stock -= item.cantidad;

    if (item.producto.stock === 0) {
      item.producto.disponible = false;
    }

    await item.producto.save();
  }

  return venta;
};
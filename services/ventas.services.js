import { readFile, writeFile } from "fs/promises";
import dayjs from "dayjs";

const rutaVentas = "./data/ventas.json";
const rutaProductos = "./data/productos.json";
const rutaUsuarios = "./data/usuarios.json";
// Leer ventas
const leerVentas = async () => {
  const archivo = await readFile(rutaVentas, "utf-8");
  return JSON.parse(archivo);
};

const guardarVentas = async (ventas) => {
    await writeFile(
        rutaVentas,
        JSON.stringify(ventas, null, 2)
    );
};

// Obtener ventas por rango de fechas
export const getVentasByFecha = async (from, to) => {
  const ventas = await leerVentas();

  return ventas.filter(
    venta => venta.fecha >= from && venta.fecha <= to
  );
};

// Obtener ventas por ID de usuario
export const getVentasByUsuarioId = async (id) => {
  const ventas = await leerVentas();

  return ventas.filter(
    venta => venta.id_usuario === id
  );
};

// Agregar venta
export const addVenta = async (nuevaVenta) => {
    const ventas = await leerVentas();

    const archivoProductos = await readFile(rutaProductos, "utf-8");
    const productos = JSON.parse(archivoProductos);

    const archivoUsuarios = await readFile(rutaUsuarios, "utf-8");
    const usuarios = JSON.parse(archivoUsuarios);

    const usuario = usuarios.find(
        usuario =>
            usuario.id === nuevaVenta.id_usuario &&
            usuario.activo
    );

    if (!usuario) {
        return "USUARIO_INVALIDO";
    }

    const productosVenta = [];

    for (const item of nuevaVenta.productos) {
        const producto = productos.find(
            producto => producto.id === item.id_producto
        );

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
            id_producto: producto.id,
            cantidad: item.cantidad,
            precio_unitario: producto.precio
        });
    }

    productosVenta.forEach(item => {
        const producto = productos.find(
            producto => producto.id === item.id_producto
        );

        producto.stock -= item.cantidad;

        if (producto.stock === 0) {
            producto.disponible = false;
        }
    });

    const subtotal = productosVenta.reduce(
        (total, item) =>
            total + item.precio_unitario * item.cantidad,
        0
    );

    const nuevoId =
        ventas.length > 0
            ? Math.max(...ventas.map(venta => venta.id)) + 1
            : 1;

    const venta = {
        id: nuevoId,
        id_usuario: nuevaVenta.id_usuario,
        fecha: dayjs().format("YYYY-MM-DD"),
        direccion: nuevaVenta.direccion,
        productos: productosVenta,
        subtotal,
        descuento: false,
        importe_descuento: 0,
        total: subtotal
    };

    ventas.push(venta);

    await guardarVentas(ventas);

    await writeFile(
        rutaProductos,
        JSON.stringify(productos, null, 2)
    );

    return venta;
};

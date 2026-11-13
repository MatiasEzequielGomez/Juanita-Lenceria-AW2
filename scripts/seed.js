import { readFile } from "fs/promises";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import Usuario from "../models/usuario.model.js";
import Producto from "../models/producto.model.js";
import Venta from "../models/venta.model.js";
import bcrypt from "bcryptjs";

const leerJSON = async (ruta) => {
  const archivo = await readFile(ruta, "utf-8");
  return JSON.parse(archivo);
};

const seed = async () => {
  try {
    await connectDB();

    const usuariosJSON = await leerJSON("./data/usuarios.json");
    const productosJSON = await leerJSON("./data/productos.json");
    const ventasJSON = await leerJSON("./data/ventas.json");

    console.log("Limpiando colecciones...");

    await Venta.deleteMany({});
    await Producto.deleteMany({});
    await Usuario.deleteMany({});

    // Migrar usuarios
    const usuariosSinId = await Promise.all(
      usuariosJSON.map(async ({ id, ...usuario }) => ({
        ...usuario,
        contraseña: await bcrypt.hash(usuario.contraseña, 10),
      })),
    );
    const usuariosCreados = await Usuario.insertMany(usuariosSinId);

    const mapaUsuarios = new Map(
      usuariosJSON.map((usuario, index) => [
        usuario.id,
        usuariosCreados[index]._id,
      ]),
    );

    console.log(`${usuariosCreados.length} usuarios migrados.`);

    // Migrar productos
    const productosSinId = productosJSON.map(({ id, ...producto }) => producto);

    const productosCreados = await Producto.insertMany(productosSinId);

    const mapaProductos = new Map(
      productosJSON.map((producto, index) => [
        producto.id,
        productosCreados[index]._id,
      ]),
    );

    console.log(`${productosCreados.length} productos migrados.`);

    // Migrar ventas
    const ventasMigradas = ventasJSON.map((venta) => {
      const usuarioMongoId = mapaUsuarios.get(venta.id_usuario);

      if (!usuarioMongoId) {
        throw new Error(
          `No se encontró el usuario ${venta.id_usuario} de la venta ${venta.id}`,
        );
      }

      const productos = venta.productos.map((item) => {
        const productoMongoId = mapaProductos.get(item.id_producto);

        if (!productoMongoId) {
          throw new Error(
            `No se encontró el producto ${item.id_producto} de la venta ${venta.id}`,
          );
        }

        return {
          id_producto: productoMongoId,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        };
      });

      return {
        id_usuario: usuarioMongoId,
        fecha: venta.fecha,
        direccion: venta.direccion,
        productos,
        subtotal: venta.subtotal,
        descuento: venta.descuento,
        importe_descuento: venta.importe_descuento,
        total: venta.total,
      };
    });

    const ventasCreadas = await Venta.insertMany(ventasMigradas);

    console.log(`${ventasCreadas.length} ventas migradas.`);
    console.log("Migración completada correctamente.");
  } catch (error) {
    console.error("Error durante la migración:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();

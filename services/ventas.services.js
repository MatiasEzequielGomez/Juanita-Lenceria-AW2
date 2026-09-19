import { readFile } from "fs/promises";

const rutaVentas = "./data/ventas.json";

// Leer ventas
const leerVentas = async () => {
  const archivo = await readFile(rutaVentas, "utf-8");
  return JSON.parse(archivo);
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


import {
  getVentasByFecha,
  getVentasByUsuarioId,
  addVenta
} from "../services/ventas.services.js";

// Obtener ventas por rango de fechas
export const obtenerVentasPorFecha = async (req, res) => {
  const { from, to } = req.query;

  try {
    const ventas = await getVentasByFecha(from, to);

    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener las ventas por fecha"
    });
  }
};

// Obtener ventas por ID de usuario
export const obtenerVentasPorUsuario = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const ventas = await getVentasByUsuarioId(id);

    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener las ventas del usuario"
    });
  }
};

// Agregar venta
export const crearVenta = async (req, res) => {
  try {
    const nuevaVenta = await addVenta(req.body);

    if (nuevaVenta === "USUARIO_INVALIDO") {
      return res.status(400).json({
        error: "Usuario inválido"
      });
    }

    if (nuevaVenta === "PRODUCTO_INVALIDO") {
      return res.status(400).json({
        error: "Producto inválido"
      });
    }

    if (nuevaVenta === "STOCK_INSUFICIENTE") {
      return res.status(400).json({
        error: "Stock insuficiente"
      });
    }

    res.status(201).json(nuevaVenta);
} catch (error) {
  console.error("Error al crear la venta:", error);

  res.status(500).json({
    error: "Error al crear la venta"
  });
}
};
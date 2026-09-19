import {
  getVentasByFecha,
  getVentasByUsuarioId
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
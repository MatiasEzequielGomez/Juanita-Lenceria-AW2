import {
  addProducto,
  updatePrecioProducto,
  deleteProducto
} from "../services/productos.services.js";

// Agregar producto
export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await addProducto(req.body);

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar producto"
    });
  }
};

// Modificar precio
export const modificarPrecioProducto = async (req, res) => {
  const id = parseInt(req.params.id);
  const nuevoPrecio = req.body.precio;

  try {
    const producto = await updatePrecioProducto(id, nuevoPrecio);

    if (!producto) {
      return res.status(404).json({
        error: "No se encontró el producto"
      });
    }

    res.status(200).json({
      mensaje: "Precio modificado",
      producto
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al modificar precio"
    });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const resultado = await deleteProducto(id);

    if (resultado === "TIENE_VENTAS") {
      return res.status(400).json({
        error: "No se puede eliminar porque tiene ventas asociadas"
      });
    }

    if (!resultado) {
      return res.status(404).json({
        error: "No se encontró el producto"
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado",
      producto: resultado
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar producto"
    });
  }
};
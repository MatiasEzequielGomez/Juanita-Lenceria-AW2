import mongoose from "mongoose";

const VentaSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    fecha: {
      type: Date,
      default: Date.now,
    },

    direccion: {
      type: String,
      required: true,
      trim: true,
    },

    productos: [
      {
        id_producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },

        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },

        precio_unitario: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    descuento: {
      type: Boolean,
      default: false,
    },

    importe_descuento: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Venta = mongoose.model("Venta", VentaSchema);

export default Venta;
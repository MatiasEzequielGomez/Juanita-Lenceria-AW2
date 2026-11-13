import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    console.log("Intentando conectar a MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log("Conectado a MongoDB exitosamente.");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
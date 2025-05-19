import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexión exitosa con Base de Datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/events.routes.js";

const app = express();

// Configuración de CORS para permitir cookies entre Railway (backend) y Netlify (frontend)
app.use(
  cors({
    origin: "https://villassports.netlify.app", // URL del frontend en Netlify
    credentials: true, // Permite el uso de cookies (JWT) entre dominios
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Ruta raiz para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("API Villas Sports funcionando");
});

// Rutas principales
app.use("/api", authRoutes);
app.use("/api/eventos", eventRoutes);

export default app;
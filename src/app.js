import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/events.routes.js";

const app = express();

app.use(cors());  // CORS para todas las rutas
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Ruta raiz para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("API Villas Sports funcionando");
});

app.use("/api", authRoutes);
app.use("/api/eventos", eventRoutes);

export default app;

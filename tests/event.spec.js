import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Event from "../src/models/event.model.js";
import bcrypt from "bcryptjs";

let mongoServer;
let token;
let userId;
let event;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Crear usuario y obtener token para autenticación
  const passwordHash = await bcrypt.hash("12345678", 10);
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    password: passwordHash,
  });
  userId = user._id.toString();

  // Login para obtener token
  const res = await request(app).post("/api/login").send({
    email: "test@example.com",
    password: "12345678",
  });
  token = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Event.deleteMany();

  // Crear un evento deportivo para pruebas
  event = await Event.create({
    nombreEvento: "Torneo UdeC Microfutbol Masculino",
    tipoEvento: "Deportivo",
    ubicacion: "Universidad de Cundinamarca seccional Ubate",
    fechaHora: new Date(),
    user: userId,
  });
});

describe("Eventos API", () => {
  test("debe crear un evento", async () => {
    const eventData = {
      nombreEvento: "Campeonato de Atletismo",
      tipoEvento: "Deportivo",
      ubicacion: "Estadio Municipal",
      fechaHora: new Date().toISOString(),
    };

    const res = await request(app)
      .post("/api/eventos")
      .set("Cookie", `token=${token}`)
      .send(eventData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("nombreEvento", "Campeonato de Atletismo");
    expect(res.body).toHaveProperty("user", userId);
  });

  test("debe obtener todos los eventos del usuario", async () => {
    const res = await request(app)
      .get("/api/eventos")
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("debe obtener un evento por id", async () => {
    const res = await request(app)
      .get(`/api/eventos/${event._id}`)
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("nombreEvento", "Torneo UdeC Microfutbol Masculino");
  });

  test("debe actualizar un evento", async () => {
    const updateData = {
      nombreEvento: "Torneo UdeC Futbol Sala",
      tipoEvento: "Deportivo",
      ubicacion: "Cancha Cubierta",
      fechaHora: new Date().toISOString(),
    };

    const res = await request(app)
      .put(`/api/eventos/${event._id}`)
      .set("Cookie", `token=${token}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("nombreEvento", "Torneo UdeC Futbol Sala");
  });

  test("debe eliminar un evento", async () => {
    const res = await request(app)
      .delete(`/api/eventos/${event._id}`)
      .set("Cookie", `token=${token}`);

    expect(res.statusCode).toBe(204);

    const check = await Event.findById(event._id);
    expect(check).toBeNull(); // Verifica que fue eliminado
  });
});

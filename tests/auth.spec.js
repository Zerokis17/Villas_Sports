import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from '../src/app.js';
import User from "../src/models/user.model.js";
import bcrypt from "bcryptjs";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();

  const passwordHash = await bcrypt.hash("12345678", 10);
  await User.create({
    username: "testuser",
    email: "test@example.com",
    password: passwordHash,
  });
});

//Pruebas de integración para el endpoint de login
describe("POST /api/login", () => {
  test("debe loguearse exitosamente con credenciales validas", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "12345678" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test("debe fallar si el usuario no existe", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "noexiste@example.com", password: "12345678" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  test("debe fallar si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});

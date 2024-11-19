import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  // Pulisci tutti i dati dopo ogni test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("User API Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "Registrazione avvenuta con successo"
    );
  });

  it("should login the user", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject duplicate user registration", async () => {
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email già registrata");
  });

  it("should return user data for authenticated user", async () => {
    // Crea un utente finto
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    // Genera un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);

    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", user.email);
  });

  it("should return 401 for unauthenticated request", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Token mancante");
  });
});

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Crea il server MongoDB in memoria
  mongoServer = await MongoMemoryServer.create();
  // Ottieni l'URI generato automaticamente
  const uri = mongoServer.getUri();
  // Connettiti al database con l'URI
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName: "testDB" });
  }
});

afterAll(async () => {
  // Chiudi tutte le connessioni
  //   await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
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
});

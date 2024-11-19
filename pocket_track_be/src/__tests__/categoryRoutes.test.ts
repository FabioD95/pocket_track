import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import Category from "../models/Category";
import User from "../models/User";

let token: string;

beforeAll(async () => {
  await connectDB();

  // Creazione di un utente per generare un token valido
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Category API Tests", () => {
  describe("GET /api/categories", () => {
    it("should return all categories for authenticated user", async () => {
      await Category.create([{ name: "Cibo" }, { name: "Trasporti" }]);

      const res = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);

      // Controlla che l'array contenga gli oggetti desiderati, indipendentemente dall'ordine
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Cibo" }),
          expect.objectContaining({ name: "Trasporti" }),
        ])
      );
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app).get("/api/categories");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });
  });

  describe("POST /api/categories", () => {
    it("should add a new category for authenticated user", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nuova Categoria" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Categoria aggiunta con successo"
      );
      expect(res.body.category).toHaveProperty("name", "Nuova Categoria");

      const categoryInDb = await Category.findOne({ name: "Nuova Categoria" });
      expect(categoryInDb).not.toBeNull();
    });

    it("should not add a duplicate category", async () => {
      await Category.create({ name: "Esistente" });

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Esistente" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Categoria già esistente");
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app)
        .post("/api/categories")
        .send({ name: "Nuova Categoria" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });

    it("should return 500 for server error", async () => {
      jest.spyOn(Category.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Errore del server simulato");
      });

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Errore" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("message", "Errore del server simulato");
    });
  });
});

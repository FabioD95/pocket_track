import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import Tag from "../models/Tag";
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

  // Generazione di un token JWT
  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  // Pulizia delle collezioni dopo ogni test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Tag API Tests", () => {
  describe("GET /api/tags", () => {
    it("should return all tags for authenticated user", async () => {
      // Aggiunta di alcuni tag nel database
      await Tag.create([{ name: "Birra" }, { name: "Benzina" }]);

      const res = await request(app)
        .get("/api/tags")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);

      // Controlla che l'array contenga gli oggetti desiderati, indipendentemente dall'ordine
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Birra" }),
          expect.objectContaining({ name: "Benzina" }),
        ])
      );
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app).get("/api/tags");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });
  });

  describe("POST /api/tags", () => {
    it("should add a new tag for authenticated user", async () => {
      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nuovo Tag" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Tag aggiunto con successo");
      expect(res.body.tag).toHaveProperty("name", "Nuovo Tag");

      const tagInDb = await Tag.findOne({ name: "Nuovo Tag" });
      expect(tagInDb).not.toBeNull();
    });

    it("should not add a duplicate tag", async () => {
      // Creazione di un tag esistente
      await Tag.create({ name: "Esistente" });

      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Esistente" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Tag già esistente");
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app)
        .post("/api/tags")
        .send({ name: "Nuovo Tag" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });

    it("should return 500 for server error", async () => {
      // Simula un errore forzando un problema con il database
      jest.spyOn(Tag.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Errore del server simulato");
      });

      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Errore" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("message", "Errore del server simulato");
    });
  });
});

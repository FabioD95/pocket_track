import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import Family from "../models/Family";
import User from "../models/User";

let token: string;
let userId: string;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  userId = user.id;
  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await disconnectDB();
});

describe("Family API Tests", () => {
  describe("POST /api/families", () => {
    it("should add a new family for the authenticated user", async () => {
      const res = await request(app)
        .post("/api/families")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nuova Famiglia" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Famiglia aggiunta con successo"
      );
      expect(res.body.family).toHaveProperty("name", "Nuova Famiglia");

      const familyInDb = await Family.findOne({ name: "Nuova Famiglia" });
      expect(familyInDb).not.toBeNull();
      expect(familyInDb?.createdBy.toString()).toBe(userId);
    });

    it("should not add a family with a duplicate name", async () => {
      await Family.create({ name: "Famiglia Duplicata", createdBy: userId });

      const res = await request(app)
        .post("/api/families")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Famiglia Duplicata" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Famiglia già esistente");
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app)
        .post("/api/families")
        .send({ name: "Famiglia Non Autenticata" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });
  });

  describe("GET /api/families", () => {
    it("should return all families for the authenticated user", async () => {
      const family1 = await Family.create({
        name: "Famiglia 1",
        createdBy: userId,
      });
      const family2 = await Family.create({
        name: "Famiglia 2",
        createdBy: userId,
      });
      await User.findByIdAndUpdate(userId, {
        families: [family1.id, family2.id],
      });

      const res = await request(app)
        .get("/api/families")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Famiglia 1" }),
          expect.objectContaining({ name: "Famiglia 2" }),
        ])
      );
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app).get("/api/families");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });

    it("should return 404 if user does not exist", async () => {
      await User.findByIdAndDelete(userId);

      const res = await request(app)
        .get("/api/families")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Utente non trovato");
    });
  });

  describe("GET /api/families/users", () => {
    it("should return all users associated with a specific family", async () => {
      const family = await Family.create({
        name: "Famiglia Condivisa",
        createdBy: userId,
      });

      await User.findByIdAndUpdate(userId, { families: [family.id] });

      const res = await request(app)
        .get("/api/families/users")
        .set("Authorization", `Bearer ${token}`)
        .query({ familyId: family.id });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty("name", "Test User");
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app)
        .get("/api/families/users")
        .send({ familyId: new mongoose.Types.ObjectId().toString() });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });

    it("should handle server errors gracefully", async () => {
      jest.spyOn(User, "find").mockImplementationOnce(() => {
        throw new Error("Errore del server simulato");
      });

      const res = await request(app)
        .get("/api/families/users")
        .set("Authorization", `Bearer ${token}`)
        .query({ familyId: new mongoose.Types.ObjectId().toString() });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "getUserFamily: Errore del server simulato"
      );
    });
  });
});

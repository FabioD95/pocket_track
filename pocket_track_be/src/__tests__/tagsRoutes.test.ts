import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import Tag from "../models/Tag";
import User from "../models/User";
import Family from "../models/Family";

let token: string;
let userId: string;
let familyId: string;

beforeAll(async () => {
  await connectDB();

  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    families: [familyId],
  });

  const family = await Family.create({
    name: "Test Family",
    createdBy: user.id,
  });
  familyId = family.id;

  await User.findByIdAndUpdate(user.id, { families: [familyId] });

  userId = user.id;
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

describe("Tag API Tests", () => {
  describe("GET /api/tags", () => {
    it("should return all tags for the authenticated user's family", async () => {
      await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Spesa", familyId: familyId });
      await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Lavoro", familyId: familyId });
      await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Altro",
          familyId: new mongoose.Types.ObjectId().toString(),
        });

      const res = await request(app)
        .get("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .query({ familyId: familyId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Spesa" }),
          expect.objectContaining({ name: "Lavoro" }),
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
    it("should add a new tag for the authenticated user's family", async () => {
      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nuovo Tag", familyId: familyId });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Tag aggiunto con successo");
      expect(res.body.tag).toHaveProperty("name", "Nuovo Tag");

      const tagInDb = await Tag.findOne({
        name: "Nuovo Tag",
      });
      expect(tagInDb).not.toBeNull();
    });

    it("should not add a duplicate tag for the same family", async () => {
      await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Duplicato", familyId: familyId });
      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Duplicato", familyId: familyId });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Tag già esistente");
    });

    it("should allow duplicate tags for different families", async () => {
      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Comune", familyId: familyId });
      await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Comune",
          familyId: new mongoose.Types.ObjectId().toString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.tag).toHaveProperty("name", "Comune");

      const tagInDb = await Tag.findOne({
        name: "Comune",
      });
      expect(tagInDb).not.toBeNull();
    });

    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app).post("/api/tags").send({
        name: "Nuovo Tag",
        familyId: new mongoose.Types.ObjectId().toString(),
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Token mancante");
    });

    it("should return 500 for server error", async () => {
      jest.spyOn(Tag.prototype, "save").mockImplementationOnce(() => {
        throw new Error("Errore del server simulato");
      });

      const res = await request(app)
        .post("/api/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Errore" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty(
        "message",
        "addTag: Errore del server simulato"
      );
    });
  });
});

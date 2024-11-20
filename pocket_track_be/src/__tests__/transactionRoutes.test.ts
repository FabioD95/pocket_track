import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB, { disconnectDB } from "../config/db";
import app from "../app";
import User from "../models/User";
import Family from "../models/Family";
import Category from "../models/Category";
import Tag from "../models/Tag";
import Transaction from "../models/transaction";

let token: string;
let userId: string;
let familyId: string;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  // Creazione di un utente per generare un token valido
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    families: [familyId],
  });

  // Creazione di una famiglia per l'utente
  const family = await Family.create({
    name: "Test Family",
    createdBy: user.id,
  });
  familyId = family.id;

  // Aggiornamento dell'utente con l'id della famiglia
  await User.findByIdAndUpdate(user.id, { families: [familyId] });

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

describe("Transaction API Tests", () => {
  describe("POST /api/transactions", () => {
    it("should add a new transaction", async () => {
      const category = await Category.create({
        name: "Test Category",
        createdBy: userId,
      });
      const tag1 = await Tag.create({ name: "Tag 1", createdBy: userId });
      const tag2 = await Tag.create({ name: "Tag 2", createdBy: userId });

      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          familyId,
          transaction: {
            amount: 100,
            date: new Date(),
            isExpense: true,
            user: userId,
            category: category.id,
            tags: [tag1.id, tag2.id],
            description: "Test Transaction",
            isNecessary: true,
            isTransfer: false,
          },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Transazione aggiunta con successo"
      );
      expect(res.body.transaction).toHaveProperty("amount", 100);

      const family = await Family.findById(familyId);
      expect(family?.transactions).toHaveLength(1);
    });

    it("should return 400 if transfer beneficiary is missing for transfer", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          familyId,
          transaction: {
            amount: 200,
            date: new Date(),
            isExpense: false,
            user: userId,
            isTransfer: true,
          },
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Il beneficiario è obbligatorio"
      );
    });
  });
  describe("POST /api/transactions - Transfer", () => {
    it("should add a transfer transaction", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          familyId,
          transaction: {
            amount: 300,
            date: new Date(),
            user: userId,
            transferBeneficiary: new mongoose.Types.ObjectId().toString(),
            description: "Test Transfer",
            isTransfer: true,
          },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Transazione aggiunta con successo"
      );
      expect(res.body.transaction).toHaveLength(2);

      const family = await Family.findById(familyId);
      expect(family?.transactions).toHaveLength(2);
    });
  });
  describe("GET /api/transactions", () => {
    it("should get all transactions for a family", async () => {
      const transaction1 = await Transaction.create({
        amount: 150,
        date: new Date(),
        isExpense: true,
        user: userId,
        familyId,
      });

      const transaction2 = await Transaction.create({
        amount: 200,
        date: new Date(),
        isExpense: false,
        user: userId,
        familyId,
      });

      await Family.findByIdAndUpdate(familyId, {
        transactions: [transaction1.id, transaction2.id],
      });

      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .query({ familyId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ amount: 150 }),
          expect.objectContaining({ amount: 200 }),
        ])
      );
    });

    it("should return 404 if family does not exist", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .query({ familyId: new mongoose.Types.ObjectId().toString() });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Famiglia non trovata");
    });
  });
});

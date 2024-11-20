import express from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);

router.get("/", authMiddleware, getTransactions);

export default router;

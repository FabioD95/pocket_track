import express from "express";
import { addTransaction } from "../controllers/transactionController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addTransaction);

export default router;

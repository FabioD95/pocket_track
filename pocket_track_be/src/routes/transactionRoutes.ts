import express from "express";
import { addTransaction } from "../controllers/transactionController";

const router = express.Router();

router.post("/add", addTransaction);

export default router;

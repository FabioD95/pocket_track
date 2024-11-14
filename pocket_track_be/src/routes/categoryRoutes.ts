import express from "express";
import { addCategory } from "../controllers/categoryController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addCategory);

export default router;

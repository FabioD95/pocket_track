import express from "express";
import { addTag } from "../controllers/tagController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware, addTag);

export default router;

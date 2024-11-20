import express from "express";
import { addCategory, getCategories } from "../controllers/categoryController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addCategory);
router.get("/", authMiddleware, getCategories);

export default router;

import express from "express";
import {
  addCategory,
  getAllCategories,
} from "../controllers/categoryController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addCategory);
router.get("/", authMiddleware, getAllCategories);

export default router;

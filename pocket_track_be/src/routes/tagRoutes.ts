import express from "express";
import { addTag, getAllTags } from "../controllers/tagController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addTag);
router.get("/", authMiddleware, getAllTags);

export default router;

import express from "express";
import { addTag, getTags } from "../controllers/tagController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addTag);
router.get("/", authMiddleware, getTags);

export default router;

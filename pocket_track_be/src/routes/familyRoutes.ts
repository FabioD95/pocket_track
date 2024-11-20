import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  addFamily,
  getFamilies,
  getUsersByFamilyId,
} from "../controllers/familyController";

const router = express.Router();

router.post("/", authMiddleware, addFamily);

router.get("/", authMiddleware, getFamilies);
router.get("/users", authMiddleware, getUsersByFamilyId);

export default router;

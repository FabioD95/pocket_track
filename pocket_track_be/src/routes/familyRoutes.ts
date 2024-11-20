import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { addFamily, getUsersByFamilyId } from "../controllers/familyController";

const router = express.Router();

router.post("/", authMiddleware, addFamily);
router.get("/getUsersFamily", authMiddleware, getUsersByFamilyId);

export default router;

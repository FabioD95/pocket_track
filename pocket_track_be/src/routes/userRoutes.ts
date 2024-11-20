import express from "express";
import {
  registerUser,
  loginUser,
  getUserData,
  addFamilyToUser,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addFamily", authMiddleware, addFamilyToUser);

router.get("/me", authMiddleware, getUserData);

export default router;

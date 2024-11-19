import express from "express";
import {
  registerUser,
  loginUser,
  getUserData,
  getAllUsers,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserData);
router.get("/all", authMiddleware, getAllUsers);

export default router;

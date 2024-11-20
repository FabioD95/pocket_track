import e, { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthRequest } from "../utils/types";
import { getUserById } from "../queries/userQuery";
import { errorResponse } from "../utils/error";

// registerUser
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "Email già registrata" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registrazione avvenuta con successo" });
  } catch (error) {
    errorResponse(res, error, "registerUser");
  }
};

// loginUser
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Credenziali non valide" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenziali non valide" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "100 days",
    });

    res.json({ token });
  } catch (error) {
    errorResponse(res, error, "loginUser");
  }
};

// getUserData
export const getUserData = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");

    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error });
  }
};

// addFamilyToUser
export const addFamilyToUser = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    const { familyId } = req.body;

    user.families.push(familyId);

    await user.save();
    res.status(201).json({ message: "Categoria aggiunta con successo", user });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error });
  }
};

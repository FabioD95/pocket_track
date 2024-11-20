import { Request, Response } from "express";
import Family from "../models/Family";
import { IAuthRequest } from "../utils/types";
import { getUserById } from "../queries/userQuery";
import { errorResponse } from "../utils/error";
import User from "../models/User";

// addFamily
export const addFamily = async (req: IAuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!req.user) throw new Error("Utente non autorizzato");

    const existingFamily = await Family.findOne({ name });
    if (existingFamily) {
      res.status(400).json({ message: "Famiglia già esistente" });
      return;
    }

    const family = new Family({
      name,
      createdBy: req.user.id,
    });
    await family.save();

    res.status(201).json({ message: "Famiglia aggiunta con successo", family });
  } catch (error) {
    errorResponse(res, error, "addFamily");
  }
};

// getFamilies
// Not recommended to use this function, Families is already attached to the user
export const getFamilies = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");
    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
      return;
    }

    const families = await Family.find({
      _id: { $in: user.families },
    });

    res.json(families);
  } catch (error) {
    errorResponse(res, error, "getFamilies");
  }
};

// getUsersByFamilyId
export const getUsersByFamilyId = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.query;

    if (!familyId) {
      res.status(400).json({ message: "ID famiglia mancante" });
      return;
    }

    const users = await User.find({
      families: familyId,
    }).select("-password");

    res.json(users);
  } catch (error) {
    errorResponse(res, error, "getUserFamily");
  }
};

import { Response } from "express";
import Category from "../models/Category";
import { IAuthRequest } from "../utils/types";
import { errorResponse } from "../utils/error";
import Family from "../models/Family";

// addCategory
export const addCategory = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");

    const { name, familyId } = req.body;
    if (!name || !familyId) {
      res.status(400).json({ message: "Parametri mancanti" });
      return;
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ message: "Categoria già esistente" });
      return;
    }

    const category = new Category({ name, createdBy: req.user.id });
    await category.save();

    // add category to family
    await Family.updateOne(
      { _id: familyId },
      { $push: { categories: category._id } }
    );

    res
      .status(201)
      .json({ message: "Categoria aggiunta con successo", category });
  } catch (error) {
    errorResponse(res, error, "addCategory");
  }
};

// getCategories
export const getCategories = async (req: IAuthRequest, res: Response) => {
  try {
    const { familyId } = req.query;
    const family = await Family.findById(familyId);

    if (!family) {
      res.status(404).json({ message: "Famiglia non trovata" });
      return;
    }

    const categories = await Category.find({
      _id: { $in: family.categories },
    });

    res.json(categories);
  } catch (error) {
    errorResponse(res, error, "getCategories");
  }
};

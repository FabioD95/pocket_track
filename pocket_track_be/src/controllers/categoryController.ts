import { Request, Response } from "express";
import Category, { ICategory } from "../models/Category";

export const addCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ message: "Categoria già esistente" });
      return;
    }

    const category = new Category({ name });
    await category.save();

    res
      .status(201)
      .json({ message: "Categoria aggiunta con successo", category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

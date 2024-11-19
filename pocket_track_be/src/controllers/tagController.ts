import { Request, Response } from "express";
import Tag, { ITag } from "../models/Tag";

export const addTag = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      res.status(400).json({ message: "Tag già esistente" });
      return;
    }

    const tag = new Tag({ name });
    await tag.save();

    res.status(201).json({ message: "Tag aggiunto con successo", tag });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

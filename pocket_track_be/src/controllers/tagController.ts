import { Response } from "express";
import Tag from "../models/Tag";
import { IAuthRequest } from "../utils/types";
import { errorResponse } from "../utils/error";
import Family from "../models/Family";

// addTag
export const addTag = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");

    const { name, familyId } = req.body;
    if (!name || !familyId) {
      res.status(400).json({ message: "Parametri mancanti" });
      return;
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      res.status(400).json({ message: "Tag già esistente" });
      return;
    }

    const tag = new Tag({ name, createdBy: req.user.id });
    await tag.save();

    // add tag to family
    await Family.updateOne({ _id: familyId }, { $push: { tags: tag._id } });

    res.status(201).json({ message: "Tag aggiunto con successo", tag });
  } catch (error) {
    errorResponse(res, error, "addTag");
  }
};

// getTags
export const getTags = async (req: IAuthRequest, res: Response) => {
  try {
    const { familyId } = req.query;
    const family = await Family.findById(familyId);

    if (!family) {
      res.status(404).json({ message: "Famiglia non trovata" });
      return;
    }

    const tags = await Tag.find({
      _id: { $in: family.tags },
    });

    res.json(tags);
  } catch (error) {
    errorResponse(res, error, "getAllTags");
  }
};

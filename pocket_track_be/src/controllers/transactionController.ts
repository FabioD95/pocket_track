import { Request, Response } from "express";
import Transaction, { ITransaction } from "../models/Transaction";

export const addTransaction = async (req: Request, res: Response) => {
  const {
    amount,
    date,
    type,
    executedBy,
    beneficiary,
    category,
    tags,
    description,
    isNecessary,
  } = req.body;

  try {
    const transaction = new Transaction({
      amount,
      date,
      type,
      executedBy,
      beneficiary,
      category,
      tags,
      description,
      isNecessary,
    });

    await transaction.save();

    res
      .status(201)
      .json({ message: "Transazione aggiunta con successo", transaction });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

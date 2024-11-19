import { Request, Response } from "express";
import Transaction from "../models/transaction";

export const addTransaction = async (req: Request, res: Response) => {
  const {
    amount,
    date,
    type,
    user,
    transferBeneficiary,
    category,
    tags,
    description,
    isNecessary,
    isTransfer,
  } = req.body;

  if (isTransfer && !transferBeneficiary) {
    res.status(400).json({ message: "Il beneficiario è obbligatorio" });
    return;
  }

  if (isTransfer) {
    await transfer(req, res);
    return;
  }

  try {
    const transaction = new Transaction({
      amount,
      date,
      type,
      user,
      transferBeneficiary,
      category,
      tags,
      description,
      isNecessary,
      isTransfer,
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

async function transfer(req: Request, res: Response) {
  const { amount, date, user, transferBeneficiary, description, isTransfer } =
    req.body;

  try {
    const transactionOut = new Transaction({
      amount,
      date,
      type: "expense",
      user,
      transferBeneficiary,
      description,
      isTransfer,
    });
    const transactionIn = new Transaction({
      amount,
      date,
      type: "income",
      user: transferBeneficiary,
      transferBeneficiary: user,
      description,
      isTransfer,
    });

    await transactionOut.save();
    await transactionIn.save();

    res.status(201).json({
      message: "Transazione aggiunta con successo",
      transaction: [transactionOut, transactionIn],
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
}

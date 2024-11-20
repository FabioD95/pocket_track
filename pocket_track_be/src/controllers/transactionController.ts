import { Request, Response } from "express";
import Transaction from "../models/transaction";
import { errorResponse } from "../utils/error";

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      date,
      isExpense,
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

    const transaction = new Transaction({
      amount,
      date,
      isExpense,
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
    errorResponse(res, error, "addTransaction");
  }
};

async function transfer(req: Request, res: Response) {
  try {
    const { amount, date, user, transferBeneficiary, description, isTransfer } =
      req.body;

    const transactionOut = new Transaction({
      amount,
      date,
      isExpense: true,
      user,
      transferBeneficiary,
      description,
      isTransfer,
    });
    const transactionIn = new Transaction({
      amount,
      date,
      isExpense: false,
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
    errorResponse(res, error, "transfer");
  }
}

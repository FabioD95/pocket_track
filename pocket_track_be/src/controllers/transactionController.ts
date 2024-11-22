import { Request, Response } from "express";
import Transaction from "../models/transaction";
import { errorResponse } from "../utils/error";
import Tag from "../models/Tag";
import Category from "../models/Category";
import Family from "../models/Family";
import { IAuthRequest } from "../utils/types";

// addTransaction
export const addTransaction = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) throw new Error("Utente non autorizzato");

    const {
      transaction: {
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
      },
      familyId,
    } = req.body;

    if (!familyId) {
      res.status(400).json({ message: "Parametri mancanti" });
      return;
    }

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
      createdBy: req.user.id,
    });
    await transaction.save();

    // update family transactions
    await Family.updateOne(
      { _id: familyId },
      { $push: { transactions: transaction._id } }
    );

    // update tags usageCount
    const tagsToUpdate = await Tag.find({ _id: { $in: tags } });
    tagsToUpdate.forEach(async (tag) => {
      await Tag.updateOne({ _id: tag._id }, { usageCount: tag.usageCount + 1 });
    });

    // update category usageCount
    await Category.updateOne({ _id: category }, { $inc: { usageCount: 1 } });

    res
      .status(201)
      .json({ message: "Transazione aggiunta con successo", transaction });
  } catch (error) {
    errorResponse(res, error, "addTransaction");
  }
};

// transfer function
async function transfer(req: IAuthRequest, res: Response) {
  try {
    const {
      transaction: {
        amount,
        date,
        user,
        transferBeneficiary,
        description,
        isTransfer,
      },
      familyId,
    } = req.body;
    if (!req.user) throw new Error("Utente non autorizzato");

    const transactionOut = new Transaction({
      amount,
      date,
      isExpense: true,
      user,
      transferBeneficiary,
      description,
      isTransfer,
      createdBy: req.user.id,
    });
    const transactionIn = new Transaction({
      amount,
      date,
      isExpense: false,
      user: transferBeneficiary,
      transferBeneficiary: user,
      description,
      isTransfer,
      createdBy: req.user.id,
    });
    await transactionOut.save();
    await transactionIn.save();

    // update family transactions
    await Family.updateOne(
      { _id: familyId },
      { $push: { transactions: [transactionOut._id, transactionIn._id] } }
    );

    res.status(201).json({
      message: "Transazione aggiunta con successo",
      transaction: [transactionOut, transactionIn],
    });
  } catch (error) {
    errorResponse(res, error, "transfer");
  }
}

// getTransactions by familyId
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.query;

    const family = await Family.findById(familyId);

    if (!family) {
      res.status(404).json({ message: "Famiglia non trovata" });
      return;
    }

    const transactions = await Transaction.find({
      _id: { $in: family.transactions },
    });

    res.json(transactions);
  } catch (error) {
    errorResponse(res, error, "getTransactions");
  }
};

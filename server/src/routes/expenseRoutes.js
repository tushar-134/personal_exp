import express from "express";
import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { evaluateNotifications } from "../services/notificationService.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(expenses);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { amount, category, date, description, paymentMethod } = req.body;

    if (!amount || !category || !date) {
      res.status(400);
      throw new Error("Amount, category, and date are required.");
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      date,
      description,
      paymentMethod,
    });

    await evaluateNotifications({ userId: req.user._id, expense });
    res.status(201).json(expense);
  })
);

router.put(
  "/:expenseId",
  asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    if (!mongoose.isValidObjectId(expenseId)) {
      res.status(400);
      throw new Error("Invalid expense id.");
    }

    const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });

    if (!expense) {
      res.status(404);
      throw new Error("Expense not found.");
    }

    Object.assign(expense, req.body);
    await expense.save();
    await evaluateNotifications({ userId: req.user._id, expense });

    res.json(expense);
  })
);

router.delete(
  "/:expenseId",
  asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    if (!mongoose.isValidObjectId(expenseId)) {
      res.status(400);
      throw new Error("Invalid expense id.");
    }

    const expense = await Expense.findOneAndDelete({ _id: expenseId, user: req.user._id });
    if (!expense) {
      res.status(404);
      throw new Error("Expense not found.");
    }

    res.json({ message: "Expense deleted." });
  })
);

export default router;

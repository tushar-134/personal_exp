import express from "express";
import mongoose from "mongoose";
import Budget from "../models/Budget.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getBudgetStatus } from "../utils/financialInsights.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
    const status = await getBudgetStatus(req.user._id);

    res.json({ budgets, status });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { category = "Overall", period, amount } = req.body;

    if (!period || !amount) {
      res.status(400);
      throw new Error("Period and amount are required.");
    }

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        period,
      },
      {
        user: req.user._id,
        category,
        period,
        amount,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(201).json(budget);
  })
);

router.delete(
  "/:budgetId",
  asyncHandler(async (req, res) => {
    const { budgetId } = req.params;

    if (!mongoose.isValidObjectId(budgetId)) {
      res.status(400);
      throw new Error("Invalid budget id.");
    }

    const budget = await Budget.findOneAndDelete({ _id: budgetId, user: req.user._id });
    if (!budget) {
      res.status(404);
      throw new Error("Budget not found.");
    }

    res.json({ message: "Budget deleted." });
  })
);

export default router;

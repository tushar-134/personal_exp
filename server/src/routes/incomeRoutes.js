import express from "express";
import mongoose from "mongoose";
import Income from "../models/Income.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const incomes = await Income.find({ user: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(incomes);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { amount, source, date, description } = req.body;

    if (!amount || !source || !date) {
      res.status(400);
      throw new Error("Amount, source, and date are required.");
    }

    const income = await Income.create({
      user: req.user._id,
      amount,
      source,
      date,
      description,
    });

    res.status(201).json(income);
  })
);

router.put(
  "/:incomeId",
  asyncHandler(async (req, res) => {
    const { incomeId } = req.params;

    if (!mongoose.isValidObjectId(incomeId)) {
      res.status(400);
      throw new Error("Invalid income id.");
    }

    const income = await Income.findOne({ _id: incomeId, user: req.user._id });

    if (!income) {
      res.status(404);
      throw new Error("Income not found.");
    }

    Object.assign(income, req.body);
    await income.save();

    res.json(income);
  })
);

router.delete(
  "/:incomeId",
  asyncHandler(async (req, res) => {
    const { incomeId } = req.params;

    if (!mongoose.isValidObjectId(incomeId)) {
      res.status(400);
      throw new Error("Invalid income id.");
    }

    const income = await Income.findOneAndDelete({ _id: incomeId, user: req.user._id });
    if (!income) {
      res.status(404);
      throw new Error("Income not found.");
    }

    res.json({ message: "Income deleted." });
  })
);

export default router;

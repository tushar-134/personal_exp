import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const [
      totalUsers,
      totalAdmins,
      totalExpenses,
      totalIncomeEntries,
      totalBudgets,
      totalNotifications,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      Expense.countDocuments(),
      Income.countDocuments(),
      Budget.countDocuments(),
      Notification.countDocuments(),
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalExpenses,
      totalIncomeEntries,
      totalBudgets,
      totalNotifications,
    });
  })
);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  })
);

router.patch(
  "/users/:userId/role",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400);
      throw new Error("Invalid user id.");
    }

    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Role must be user or admin.");
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.json(user);
  })
);

router.delete(
  "/users/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400);
      throw new Error("Invalid user id.");
    }

    if (String(req.user._id) === userId) {
      res.status(400);
      throw new Error("You cannot delete your own admin account.");
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    await Promise.all([
      Expense.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
    ]);

    res.json({ message: "User and related data deleted." });
  })
);

export default router;

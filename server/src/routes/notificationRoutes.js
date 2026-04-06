import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  })
);

router.patch(
  "/:notificationId/read",
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    if (!mongoose.isValidObjectId(notificationId)) {
      res.status(400);
      throw new Error("Invalid notification id.");
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found.");
    }

    res.json(notification);
  })
);

export default router;

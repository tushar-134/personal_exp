import express from "express";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardSnapshot } from "../utils/financialInsights.js";

const router = express.Router();

router.use(protect);

router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const snapshot = await getDashboardSnapshot(req.user._id, req.query);
    res.json(snapshot);
  })
);

export default router;

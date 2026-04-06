import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";
import { getMonthKey, getMonthRange, getWeekKey, getWeekRange } from "../utils/date.js";

const createNotificationOnce = async ({ user, type, title, message, cycleKey }) => {
  const existing = await Notification.findOne({ user, type, title, cycleKey });
  if (existing) {
    return existing;
  }

  return Notification.create({
    user,
    type,
    title,
    message,
    cycleKey,
  });
};

export const evaluateNotifications = async ({ userId, expense }) => {
  const expenseDate = new Date(expense.date);
  const budgets = await Budget.find({
    user: userId,
    $or: [{ category: "Overall" }, { category: expense.category }],
  }).lean();

  await Promise.all(
    budgets.map(async (budget) => {
      const range =
        budget.period === "weekly"
          ? getWeekRange(expenseDate)
          : getMonthRange(expenseDate.getFullYear(), expenseDate.getMonth() + 1);
      const cycleKey =
        budget.period === "weekly"
          ? `${budget._id}-${getWeekKey(expenseDate)}`
          : `${budget._id}-${getMonthKey(expenseDate)}`;

      const match = {
        user: userId,
        date: { $gte: range.start, $lt: range.end },
      };

      if (budget.category !== "Overall") {
        match.category = budget.category;
      }

      const [spentResult] = await Expense.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const spent = spentResult?.total ?? 0;
      if (spent > budget.amount) {
        await createNotificationOnce({
          user: userId,
          type: "budget",
          title: `${budget.category} budget exceeded`,
          message: `Spending reached Rs. ${spent.toLocaleString("en-IN")} against a Rs. ${budget.amount.toLocaleString("en-IN")} ${budget.period} budget.`,
          cycleKey,
        });
      }
    })
  );

  const recentExpenses = await Expense.find({
    user: userId,
    _id: { $ne: expense._id },
  })
    .sort({ date: -1, createdAt: -1 })
    .limit(5)
    .lean();

  if (recentExpenses.length >= 3) {
    const average =
      recentExpenses.reduce((sum, item) => sum + item.amount, 0) / recentExpenses.length;

    if (expense.amount >= Math.max(average * 1.75, 5000)) {
      await createNotificationOnce({
        user: userId,
        type: "unusual",
        title: "Unusual spending detected",
        message: `A transaction of Rs. ${expense.amount.toLocaleString("en-IN")} is much higher than your recent average.`,
        cycleKey: `${expense._id}-unusual`,
      });
    }
  }
};

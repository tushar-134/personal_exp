import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Notification from "../models/Notification.js";
import { buildMonthLabels, getMonthRange, getWeekRange } from "./date.js";

const aggregateTotal = async (Model, userId, start, end) => {
  const [result] = await Model.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result?.total ?? 0;
};

export const getBudgetStatus = async (userId, anchorDate = new Date()) => {
  const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 }).lean();
  const anchor = new Date(anchorDate);

  const statuses = await Promise.all(
    budgets.map(async (budget) => {
      const range =
        budget.period === "weekly"
          ? getWeekRange(anchor)
          : getMonthRange(anchor.getFullYear(), anchor.getMonth() + 1);

      const match = {
        user: budget.user,
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
      const utilization =
        budget.amount > 0 ? Number(((spent / budget.amount) * 100).toFixed(1)) : 0;

      return {
        _id: budget._id,
        category: budget.category,
        period: budget.period,
        amount: budget.amount,
        spent,
        remaining: Math.max(budget.amount - spent, 0),
        utilization,
        isExceeded: spent > budget.amount,
      };
    })
  );

  return statuses.sort((a, b) => b.utilization - a.utilization);
};

export const getDashboardSnapshot = async (userId, { month, year } = {}) => {
  const now = new Date();
  const activeYear = Number(year) || now.getFullYear();
  const activeMonth = Number(month) || now.getMonth() + 1;
  const { start, end } = getMonthRange(activeYear, activeMonth);
  const anchorDate = new Date(activeYear, activeMonth - 1, 1);

  const [
    expenseTotal,
    incomeTotal,
    categoryBreakdown,
    recentExpenses,
    recentIncome,
    notifications,
    budgetStatus,
  ] = await Promise.all([
    aggregateTotal(Expense, userId, start, end),
    aggregateTotal(Income, userId, start, end),
    Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Expense.find({
      user: userId,
      date: { $gte: start, $lt: end },
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean(),
    Income.find({
      user: userId,
      date: { $gte: start, $lt: end },
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean(),
    Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(6).lean(),
    getBudgetStatus(userId, anchorDate),
  ]);

  const balance = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? Number(((balance / incomeTotal) * 100).toFixed(1)) : 0;

  const trendSeeds = buildMonthLabels(6);
  const monthlyTrend = await Promise.all(
    trendSeeds.map(async (seed) => {
      const range = getMonthRange(seed.year, seed.month);
      const [monthExpense, monthIncome] = await Promise.all([
        aggregateTotal(Expense, userId, range.start, range.end),
        aggregateTotal(Income, userId, range.start, range.end),
      ]);

      return {
        label: seed.label,
        expense: monthExpense,
        income: monthIncome,
      };
    })
  );

  const topCategory = categoryBreakdown[0];
  const exceededBudgets = budgetStatus.filter((budget) => budget.isExceeded);
  const insights = [
    topCategory
      ? {
          title: `${topCategory._id} leads spending`,
          description: `${topCategory._id} accounts for Rs. ${topCategory.total.toLocaleString("en-IN")} this month.`,
          tone: "info",
        }
      : null,
    exceededBudgets.length
      ? {
          title: "Budget alert",
          description: `${exceededBudgets.length} budget limit${exceededBudgets.length > 1 ? "s are" : " is"} currently exceeded.`,
          tone: "danger",
        }
      : {
          title: "Budget health",
          description: "All tracked budgets are currently within limits.",
          tone: "success",
        },
    balance >= 0
      ? {
          title: "Positive balance",
          description: `You are ahead by Rs. ${balance.toLocaleString("en-IN")} for the selected month.`,
          tone: "success",
        }
      : {
          title: "Balance warning",
          description: `Expenses are ahead of income by Rs. ${Math.abs(balance).toLocaleString("en-IN")}.`,
          tone: "danger",
        },
  ].filter(Boolean);

  return {
    selectedMonth: activeMonth,
    selectedYear: activeYear,
    totals: {
      expense: expenseTotal,
      income: incomeTotal,
      balance,
      savingsRate,
    },
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    monthlyTrend,
    recentExpenses,
    recentIncome,
    notifications,
    budgetStatus,
    insights,
  };
};

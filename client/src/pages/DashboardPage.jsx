import { useEffect, useState } from "react";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import TrendBarChart from "../components/charts/TrendBarChart";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import BudgetStatusList from "../components/finance/BudgetStatusList";
import InsightList from "../components/finance/InsightList";
import NotificationList from "../components/finance/NotificationList";
import TransactionList from "../components/finance/TransactionList";
import { formatCurrency } from "../utils/format";

const DashboardPage = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadSnapshot = async () => {
    try {
      setError("");
      const { data } = await api.get("/reports/dashboard");
      setSnapshot(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, []);

  const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    setSnapshot((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item
      ),
    }));
  };

  if (isLoading) {
    return <div className="screen-center">Loading dashboard insights...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <StatCard
          label="Total income"
          value={formatCurrency(snapshot?.totals?.income)}
          helper="Selected month"
          tone="success"
        />
        <StatCard
          label="Total expenses"
          value={formatCurrency(snapshot?.totals?.expense)}
          helper="Selected month"
          tone="danger"
        />
        <StatCard
          label="Balance"
          value={formatCurrency(snapshot?.totals?.balance)}
          helper="Income minus expenses"
          tone={snapshot?.totals?.balance >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Savings rate"
          value={`${snapshot?.totals?.savingsRate ?? 0}%`}
          helper="Balance divided by income"
        />
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title="Monthly trend"
          description="Income and expense movement across the last six months."
        >
          <TrendBarChart data={snapshot?.monthlyTrend} />
        </SectionCard>

        <SectionCard
          title="Category split"
          description="Current month expenses grouped by category."
        >
          <CategoryBreakdownChart
            data={snapshot?.categoryBreakdown}
            emptyTitle="No expense data yet"
            emptyDescription="Add a few expenses to unlock category analysis."
          />
        </SectionCard>
      </div>

      <div className="content-grid three-column">
        <SectionCard title="Budget tracking" description="Live progress against active limits.">
          <BudgetStatusList
            budgets={snapshot?.budgetStatus}
            compact
            emptyTitle="No budgets configured"
            emptyDescription="Set a weekly or monthly budget to start monitoring limits."
          />
        </SectionCard>

        <SectionCard title="System insights" description="Automated observations from your data.">
          <InsightList
            insights={snapshot?.insights}
            emptyTitle="No insights available"
            emptyDescription="Insights will appear once the dashboard has enough financial data."
          />
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Budget alerts and unusual spending signals."
        >
          <NotificationList
            notifications={snapshot?.notifications}
            onMarkAsRead={markAsRead}
            emptyTitle="No alerts right now"
            emptyDescription="Notifications will appear when budgets are exceeded or activity looks unusual."
          />
        </SectionCard>
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title="Recent expenses"
          description="Most recent expense entries for this month."
        >
          <TransactionList
            records={snapshot?.recentExpenses}
            emptyTitle="No expenses this month"
            emptyDescription="Start by adding a few daily transactions."
          />
        </SectionCard>

        <SectionCard title="Recent income" description="Most recent income entries for this month.">
          <TransactionList
            records={snapshot?.recentIncome}
            emptyTitle="No income logged"
            emptyDescription="Add income entries to calculate balance and savings rate."
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;

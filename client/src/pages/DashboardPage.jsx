import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDate } from "../utils/format";

const colors = ["#0f766e", "#f97316", "#0ea5e9", "#f59e0b", "#16a34a", "#ef4444"];

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
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={snapshot?.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#0f766e" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="#f97316" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Category split"
          description="Current month expenses grouped by category."
        >
          {snapshot?.categoryBreakdown?.length ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={snapshot.categoryBreakdown}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                  >
                    {snapshot.categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.category} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-list">
                {snapshot.categoryBreakdown.map((item, index) => (
                  <div key={item.category} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span>{item.category}</span>
                    <strong>{formatCurrency(item.total)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No expense data yet"
              description="Add a few expenses to unlock category analysis."
            />
          )}
        </SectionCard>
      </div>

      <div className="content-grid three-column">
        <SectionCard title="Budget tracking" description="Live progress against active limits.">
          {snapshot?.budgetStatus?.length ? (
            <div className="stack-list">
              {snapshot.budgetStatus.map((budget) => (
                <div key={budget._id} className="budget-row">
                  <div className="budget-meta">
                    <div>
                      <strong>{budget.category}</strong>
                      <p className="muted">{budget.period} budget</p>
                    </div>
                    <span>{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <span
                      style={{
                        width: `${Math.min(budget.utilization, 100)}%`,
                        backgroundColor: budget.isExceeded ? "#ef4444" : "#0f766e",
                      }}
                    />
                  </div>
                  <div className="budget-meta">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>{budget.utilization}% used</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No budgets configured"
              description="Set a weekly or monthly budget to start monitoring limits."
            />
          )}
        </SectionCard>

        <SectionCard title="System insights" description="Automated observations from your data.">
          <div className="stack-list">
            {snapshot?.insights?.map((insight) => (
              <article key={insight.title} className={`insight-card ${insight.tone}`}>
                <strong>{insight.title}</strong>
                <p>{insight.description}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Budget alerts and unusual spending signals."
        >
          {snapshot?.notifications?.length ? (
            <div className="stack-list">
              {snapshot.notifications.map((item) => (
                <article
                  key={item._id}
                  className={`notification-card ${item.isRead ? "read" : ""}`}
                >
                  <div className="notification-head">
                    <strong>{item.title}</strong>
                    {!item.isRead ? (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => markAsRead(item._id)}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                  <p>{item.message}</p>
                  <span className="muted">{formatDate(item.createdAt)}</span>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No alerts right now"
              description="Notifications will appear when budgets are exceeded or activity looks unusual."
            />
          )}
        </SectionCard>
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title="Recent expenses"
          description="Most recent expense entries for this month."
        >
          {snapshot?.recentExpenses?.length ? (
            <div className="table-list">
              {snapshot.recentExpenses.map((expense) => (
                <div key={expense._id} className="table-row">
                  <div>
                    <strong>{expense.category}</strong>
                    <p className="muted">{expense.description || "No description"}</p>
                  </div>
                  <div className="table-meta">
                    <span>{formatCurrency(expense.amount)}</span>
                    <span className="muted">{formatDate(expense.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No expenses this month"
              description="Start by adding a few daily transactions."
            />
          )}
        </SectionCard>

        <SectionCard title="Recent income" description="Most recent income entries for this month.">
          {snapshot?.recentIncome?.length ? (
            <div className="table-list">
              {snapshot.recentIncome.map((income) => (
                <div key={income._id} className="table-row">
                  <div>
                    <strong>{income.source}</strong>
                    <p className="muted">{income.description || "No description"}</p>
                  </div>
                  <div className="table-meta">
                    <span>{formatCurrency(income.amount)}</span>
                    <span className="muted">{formatDate(income.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No income logged"
              description="Add income entries to calculate balance and savings rate."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default DashboardPage;

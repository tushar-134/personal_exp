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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const colors = ["#0f766e", "#f97316", "#0ea5e9", "#f59e0b", "#16a34a", "#ef4444"];
const now = new Date();

const ReportsPage = () => {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/reports/dashboard?month=${month}&year=${year}`);
        setSnapshot(data);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load report.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [month, year]);

  if (isLoading) {
    return <div className="screen-center">Generating report...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  return (
    <div className="page-stack">
      <SectionCard
        title="Monthly report filters"
        description="Change the month and year to analyze another reporting period."
      >
        <div className="filter-row">
          <label className="field compact">
            <span>Month</span>
            <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {monthNames.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="field compact">
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      <div className="stats-grid">
        <StatCard
          label="Income"
          value={formatCurrency(snapshot?.totals?.income)}
          helper={`${monthNames[month - 1]} ${year}`}
          tone="success"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(snapshot?.totals?.expense)}
          helper={`${monthNames[month - 1]} ${year}`}
          tone="danger"
        />
        <StatCard
          label="Balance"
          value={formatCurrency(snapshot?.totals?.balance)}
          helper="Net outcome for selected month"
          tone={snapshot?.totals?.balance >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Savings rate"
          value={`${snapshot?.totals?.savingsRate ?? 0}%`}
          helper="Net divided by income"
        />
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title="Category report"
          description="Expense share by category for the selected month."
        >
          {snapshot?.categoryBreakdown?.length ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={snapshot.categoryBreakdown}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={70}
                    outerRadius={112}
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
              title="No reportable expenses"
              description="Expense charts will appear once data exists for this month."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Trend report"
          description="Income versus expenses across recent months."
        >
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <div className="content-grid two-column">
        <SectionCard title="Insights" description="Generated observations for the selected month.">
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
          title="Recent activity"
          description="Recent transactions contributing to this report."
        >
          {snapshot?.recentExpenses?.length || snapshot?.recentIncome?.length ? (
            <div className="table-list">
              {[...(snapshot?.recentExpenses || []), ...(snapshot?.recentIncome || [])]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 6)
                .map((entry) => (
                  <div key={entry._id} className="table-row">
                    <div>
                      <strong>{entry.category || entry.source}</strong>
                      <p className="muted">{entry.description || "No description"}</p>
                    </div>
                    <div className="table-meta">
                      <span>{formatCurrency(entry.amount)}</span>
                      <span className="muted">{formatDate(entry.date)}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <EmptyState
              title="No recent activity"
              description="Transactions will appear here after you add expense or income entries."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default ReportsPage;

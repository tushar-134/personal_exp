import { useEffect, useState } from "react";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import TrendBarChart from "../components/charts/TrendBarChart";
import CategoryBreakdownChart from "../components/charts/CategoryBreakdownChart";
import InsightList from "../components/finance/InsightList";
import TransactionList from "../components/finance/TransactionList";
import { monthNames, getReportYears } from "../data/reporting";
import { formatCurrency } from "../utils/format";

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
              {getReportYears(now.getFullYear()).map((value) => (
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
          <CategoryBreakdownChart
            data={snapshot?.categoryBreakdown}
            height={300}
            outerRadius={112}
            emptyTitle="No reportable expenses"
            emptyDescription="Expense charts will appear once data exists for this month."
          />
        </SectionCard>

        <SectionCard
          title="Trend report"
          description="Income versus expenses across recent months."
        >
          <TrendBarChart data={snapshot?.monthlyTrend} height={300} />
        </SectionCard>
      </div>

      <div className="content-grid two-column">
        <SectionCard title="Insights" description="Generated observations for the selected month.">
          <InsightList
            insights={snapshot?.insights}
            emptyTitle="No insights available"
            emptyDescription="Insights will appear after you add enough report data."
          />
        </SectionCard>

        <SectionCard
          title="Recent activity"
          description="Recent transactions contributing to this report."
        >
          <TransactionList
            records={[...(snapshot?.recentExpenses || []), ...(snapshot?.recentIncome || [])]}
            maxItems={6}
            sortByDate
            emptyTitle="No recent activity"
            emptyDescription="Transactions will appear here after you add expense or income entries."
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default ReportsPage;

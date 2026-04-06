import EmptyState from "../EmptyState";
import { formatCurrency } from "../../utils/format";

const BudgetStatusList = ({ budgets, emptyTitle, emptyDescription, compact = false }) => {
  if (!budgets?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="stack-list">
      {budgets.map((budget) => (
        <div key={budget._id} className={`budget-row ${compact ? "" : "large"}`.trim()}>
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
                backgroundColor: budget.isExceeded ? "#c8665a" : "#355f52",
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
  );
};

export default BudgetStatusList;

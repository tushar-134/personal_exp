import { useEffect, useState } from "react";
import api from "../lib/api";
import { budgetPeriods, expenseCategories } from "../data/options";
import { formatCurrency } from "../utils/format";
import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";

const defaultForm = {
  category: "Overall",
  period: "monthly",
  amount: "",
};

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [status, setStatus] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBudgets = async () => {
    try {
      const { data } = await api.get("/budgets");
      setBudgets(data.budgets);
      setStatus(data.status);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load budgets.");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/budgets", {
        ...form,
        amount: Number(form.amount),
      });

      setForm(defaultForm);
      loadBudgets();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (budgetId) => {
    const confirmed = window.confirm("Delete this budget?");
    if (!confirmed) {
      return;
    }

    await api.delete(`/budgets/${budgetId}`);
    loadBudgets();
  };

  return (
    <div className="page-stack">
      <div className="content-grid two-column">
        <SectionCard
          title="Set budget"
          description="Create weekly or monthly budgets for overall spending or a specific category."
        >
          <form className="entity-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Overall">Overall</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Period</span>
              <select name="period" value={form.period} onChange={handleChange}>
                {budgetPeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field-span">
              <span>Budget amount</span>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="30000"
                required
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save budget"}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Active budgets"
          description="Current budget configurations in the system."
        >
          {budgets.length ? (
            <div className="table-list">
              {budgets.map((budget) => (
                <div key={budget._id} className="table-row interactive">
                  <div>
                    <strong>{budget.category}</strong>
                    <p className="muted">{budget.period} budget</p>
                  </div>
                  <div className="table-meta actions">
                    <strong>{formatCurrency(budget.amount)}</strong>
                    <button
                      type="button"
                      className="ghost-button danger-button"
                      onClick={() => handleDelete(budget._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No budgets saved"
              description="Create a budget to start tracking spending against limits."
            />
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Budget utilisation"
        description="How much of each budget has already been used."
      >
        {status.length ? (
          <div className="stack-list">
            {status.map((item) => (
              <div key={item._id} className="budget-row large">
                <div className="budget-meta">
                  <div>
                    <strong>{item.category}</strong>
                    <p className="muted">{item.period} budget</p>
                  </div>
                  <div className="align-right">
                    <strong>{formatCurrency(item.amount)}</strong>
                    <span className="muted">{formatCurrency(item.remaining)} remaining</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <span
                    style={{
                      width: `${Math.min(item.utilization, 100)}%`,
                      backgroundColor: item.isExceeded ? "#ef4444" : "#0f766e",
                    }}
                  />
                </div>
                <div className="budget-meta">
                  <span>{formatCurrency(item.spent)} spent</span>
                  <span>{item.utilization}% utilised</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing to monitor yet"
            description="Budget progress will appear here once you create limits and add expenses."
          />
        )}
      </SectionCard>
    </div>
  );
};

export default BudgetsPage;

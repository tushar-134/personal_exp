import { useEffect, useState } from "react";
import api from "../lib/api";
import { incomeSources } from "../data/options";
import { formatCurrency, formatDate } from "../utils/format";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

const today = new Date().toISOString().split("T")[0];

const defaultForm = {
  amount: "",
  source: incomeSources[0],
  date: today,
  description: "",
};

const IncomesPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadIncome = async () => {
    try {
      const { data } = await api.get("/income");
      setIncomes(data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load income.");
    }
  };

  useEffect(() => {
    loadIncome();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editingId) {
        await api.put(`/income/${editingId}`, payload);
      } else {
        await api.post("/income", payload);
      }

      resetForm();
      loadIncome();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save income.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setForm({
      amount: String(income.amount),
      source: income.source,
      date: income.date.split("T")[0],
      description: income.description || "",
    });
  };

  const handleDelete = async (incomeId) => {
    const confirmed = window.confirm("Delete this income record?");
    if (!confirmed) {
      return;
    }

    await api.delete(`/income/${incomeId}`);
    loadIncome();
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="page-stack">
      <div className="stats-grid three-up">
        <StatCard label="Entries" value={incomes.length} helper="Total income records" />
        <StatCard
          label="Tracked income"
          value={formatCurrency(totalIncome)}
          helper="Across all saved income"
          tone="success"
        />
        <StatCard
          label="Latest source"
          value={incomes[0]?.source || "None yet"}
          helper="Based on most recent entry order"
        />
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title={editingId ? "Edit income" : "Add income"}
          description="Log salary, business income, freelance payments, and other earnings."
        >
          <form className="entity-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Amount</span>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="50000"
                required
              />
            </label>
            <label className="field">
              <span>Source</span>
              <select name="source" value={form.source} onChange={handleChange}>
                {incomeSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Date</span>
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>
            <label className="field field-span">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="April salary credit"
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId ? "Update income" : "Add income"}
              </button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Income ledger" description="Review, edit, and delete income entries.">
          {incomes.length ? (
            <div className="table-list">
              {incomes.map((income) => (
                <div key={income._id} className="table-row interactive">
                  <div>
                    <strong>{income.source}</strong>
                    <p className="muted">{income.description || "No description"}</p>
                    <span className="muted">{formatDate(income.date)}</span>
                  </div>
                  <div className="table-meta actions">
                    <strong>{formatCurrency(income.amount)}</strong>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleEdit(income)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger-button"
                        onClick={() => handleDelete(income._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No income added"
              description="Use the form to add salary, business, or freelance income."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default IncomesPage;

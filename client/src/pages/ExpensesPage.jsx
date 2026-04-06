import { useEffect, useState } from "react";
import api from "../lib/api";
import { expenseCategories } from "../data/options";
import { formatCurrency, formatDate } from "../utils/format";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

const today = new Date().toISOString().split("T")[0];

const defaultForm = {
  amount: "",
  category: expenseCategories[0],
  date: today,
  description: "",
  paymentMethod: "UPI",
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load expenses.");
    }
  };

  useEffect(() => {
    loadExpenses();
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

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
      } else {
        await api.post("/expenses", payload);
      }

      resetForm();
      loadExpenses();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date.split("T")[0],
      description: expense.description || "",
      paymentMethod: expense.paymentMethod || "UPI",
    });
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm("Delete this expense record?");
    if (!confirmed) {
      return;
    }

    await api.delete(`/expenses/${expenseId}`);
    loadExpenses();
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="page-stack">
      <div className="stats-grid three-up">
        <StatCard label="Entries" value={expenses.length} helper="Total expense records" />
        <StatCard
          label="Tracked spend"
          value={formatCurrency(totalExpense)}
          helper="Across all saved expenses"
          tone="danger"
        />
        <StatCard
          label="Top category"
          value={expenses[0]?.category || "None yet"}
          helper="Based on most recent entry order"
        />
      </div>

      <div className="content-grid two-column">
        <SectionCard
          title={editingId ? "Edit expense" : "Add expense"}
          description="Capture daily spending with category, amount, date, and description."
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
                placeholder="2500"
                required
              />
            </label>
            <label className="field">
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Date</span>
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Payment method</span>
              <input
                name="paymentMethod"
                type="text"
                value={form.paymentMethod}
                onChange={handleChange}
                placeholder="UPI / Card / Cash"
              />
            </label>
            <label className="field field-span">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Dinner with friends"
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingId ? "Update expense" : "Add expense"}
              </button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Expense ledger"
          description="Review, edit, and delete recorded expenses."
        >
          {expenses.length ? (
            <div className="table-list">
              {expenses.map((expense) => (
                <div key={expense._id} className="table-row interactive">
                  <div>
                    <strong>{expense.category}</strong>
                    <p className="muted">{expense.description || "No description"}</p>
                    <span className="muted">
                      {formatDate(expense.date)} • {expense.paymentMethod || "Cash"}
                    </span>
                  </div>
                  <div className="table-meta actions">
                    <strong>{formatCurrency(expense.amount)}</strong>
                    <div className="button-row">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger-button"
                        onClick={() => handleDelete(expense._id)}
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
              title="No expenses added"
              description="Use the form to add your first expense record."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default ExpensesPage;

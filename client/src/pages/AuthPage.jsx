import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  name: "",
  email: "",
  password: "",
};

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setForm(defaultForm);
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">SE Lab Project</p>
        <h1>Personal Expense Analyzer</h1>
        <p className="muted auth-copy">
          A full-stack finance workspace for recording expenses, tracking income, setting budgets,
          generating reports, and monitoring user activity.
        </p>
        <div className="hero-grid">
          <article>
            <h3>Budget awareness</h3>
            <p className="muted">Watch spending against weekly and monthly limits in real time.</p>
          </article>
          <article>
            <h3>Category insights</h3>
            <p className="muted">Understand where money goes with charts and category summaries.</p>
          </article>
          <article>
            <h3>Admin controls</h3>
            <p className="muted">Manage users, roles, and system-level usage from one panel.</p>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        <div className="tab-row">
          <button
            type="button"
            className={`tab-button ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-button ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{mode === "login" ? "Welcome back" : "Create your account"}</p>
            <h2>{mode === "login" ? "Sign in to continue" : "Start tracking today"}</h2>
          </div>

          {mode === "register" ? (
            <label className="field">
              <span>Name</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ritik Kumar"
                required
              />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AuthPage;

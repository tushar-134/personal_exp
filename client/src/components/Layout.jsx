import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/dashboard": "Financial command center",
  "/expenses": "Expense management",
  "/income": "Income tracking",
  "/budgets": "Budget planning",
  "/reports": "Reports and analysis",
  "/admin": "Admin operations",
};

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/expenses", label: "Expenses" },
    { to: "/income", label: "Income" },
    { to: "/budgets", label: "Budgets" },
    { to: "/reports", label: "Reports" },
  ];

  if (user?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin" });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Personal Expense Analyzer</p>
          <h1>Spend with clarity.</h1>
          <p className="muted">
            Track daily expenses, compare them with income, and stay ahead of budget limits.
          </p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="muted">{user?.role === "admin" ? "Administrator" : "Standard User"}</p>
          </div>
          <button type="button" className="ghost-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="page-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>{titles[location.pathname] || "Overview"}</h2>
          </div>
          <div className="header-chip">
            <span className="dot" />
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";

const AdminPage = () => {
  const { user, setUser } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [overviewResponse, usersResponse] = await Promise.all([
        api.get("/admin/overview"),
        api.get("/admin/users"),
      ]);

      setOverview(overviewResponse.data);
      setUsers(usersResponse.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [user?.role]);

  if (user?.role !== "admin") {
    return (
      <SectionCard
        title="Admin access only"
        description="This page is reserved for administrators."
      >
        <EmptyState
          title="Restricted area"
          description="Switch to an admin account to manage users and system activity."
        />
      </SectionCard>
    );
  }

  const updateRole = async (targetUser, role) => {
    const { data } = await api.patch(`/admin/users/${targetUser._id}/role`, { role });
    setUsers((current) => current.map((entry) => (entry._id === data._id ? data : entry)));

    if (targetUser._id === user._id) {
      setUser(data);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user and all related finance records?");
    if (!confirmed) {
      return;
    }

    await api.delete(`/admin/users/${userId}`);
    setUsers((current) => current.filter((entry) => entry._id !== userId));
    loadAdminData();
  };

  if (isLoading) {
    return <div className="screen-center">Loading admin workspace...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <StatCard label="Users" value={overview?.totalUsers || 0} helper="Standard user accounts" />
        <StatCard label="Admins" value={overview?.totalAdmins || 0} helper="Privileged accounts" />
        <StatCard
          label="Expense records"
          value={overview?.totalExpenses || 0}
          helper="Tracked in MongoDB"
        />
        <StatCard
          label="Notifications"
          value={overview?.totalNotifications || 0}
          helper="Budget and unusual spend alerts"
        />
      </div>

      <SectionCard title="User management" description="Promote, demote, and remove accounts.">
        {users.length ? (
          <div className="table-list">
            {users.map((entry) => (
              <div key={entry._id} className="table-row interactive">
                <div>
                  <strong>{entry.name}</strong>
                  <p className="muted">{entry.email}</p>
                  <span className="muted">Joined {formatDate(entry.createdAt)}</span>
                </div>
                <div className="table-meta actions">
                  <select
                    value={entry.role}
                    onChange={(event) => updateRole(entry, event.target.value)}
                    disabled={entry._id === user._id}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    type="button"
                    className="ghost-button danger-button"
                    onClick={() => deleteUser(entry._id)}
                    disabled={entry._id === user._id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No users found"
            description="Registered users will appear here for admin management."
          />
        )}
      </SectionCard>
    </div>
  );
};

export default AdminPage;

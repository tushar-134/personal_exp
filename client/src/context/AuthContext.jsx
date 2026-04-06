import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("expense-analyzer-token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("expense-analyzer-token");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const saveSession = (payload) => {
    localStorage.setItem("expense-analyzer-token", payload.token);
    setUser(payload.user);
  };

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    saveSession(data);
    return data.user;
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("expense-analyzer-token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

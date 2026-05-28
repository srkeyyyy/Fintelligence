import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, signupUser, getCurrentUser } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("finance_token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("finance_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [booting, setBooting] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("finance_user", JSON.stringify(data.user));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("finance_token");
        localStorage.removeItem("finance_user");
      })
      .finally(() => setBooting(false));
  }, [token]);

  const persistSession = useCallback((data) => {
    localStorage.setItem("finance_token", data.token);
    localStorage.setItem("finance_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (payload) => {
    const data = await loginUser(payload);
    persistSession(data);
    return data;
  }, [persistSession]);

  const signup = useCallback(async (payload) => {
    const data = await signupUser(payload);
    persistSession(data);
    return data;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("finance_token");
    localStorage.removeItem("finance_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      booting,
      isAuthenticated: Boolean(token),
      login,
      logout,
      signup,
      token,
      user,
    }),
    [booting, login, logout, signup, token, user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

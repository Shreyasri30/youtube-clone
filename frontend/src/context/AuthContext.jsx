import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage on startup
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // Load token from localStorage on startup
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  });

  /* =============================
      SYNC TOKEN TO LOCAL STORAGE
  ============================== */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* =============================
      SYNC USER TO LOCAL STORAGE
  ============================== */
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        /* ignore errors */
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /* =============================
      LOGIN HANDLER
  ============================== */
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  /* =============================
      LOGOUT HANDLER
  ============================== */
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("myChannelId");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

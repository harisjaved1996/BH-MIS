import { createContext, useCallback, useContext, useState } from "react";

import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("bhmis_user");
    return stored ? JSON.parse(stored) : null;
  });
  const token = localStorage.getItem("bhmis_token");

  const login = useCallback(async (email, password) => {
    const { data } = await client.post("/auth/login/", { email, password });
    localStorage.setItem("bhmis_token", data.token);
    localStorage.setItem("bhmis_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.post("/auth/logout/");
    } catch {
      // token may already be invalid; clear locally regardless
    }
    localStorage.removeItem("bhmis_token");
    localStorage.removeItem("bhmis_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    localStorage.setItem("bhmis_user", JSON.stringify(data));
    setUser(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

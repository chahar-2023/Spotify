import { createContext, useContext, useState } from "react";
import { logoutUser } from "../apis/authAPIs";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  // user = { id, username, email, role: "user" | "artist" }
  const login = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* even if the server fails, log out here */ }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isArtist: user?.role === "artist" }}>
      {children}
    </AuthContext.Provider>
  );
}
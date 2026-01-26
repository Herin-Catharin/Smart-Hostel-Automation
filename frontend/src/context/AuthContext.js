import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null); // New state to hold {username, email, role}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedRole) {
    setToken(storedToken);
    setRole(storedRole);
    
    // ✅ FIX: Check if storedUser is not null and is NOT the string "undefined"
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        setUser(null);
      }
    }
  }
  setLoading(false);
}, []);

  // Update login to accept the 'userData' object from your Flask backend
  const login = (token, role, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(userData)); 
    
    setToken(token);
    setRole(role);
    setUser(userData); 
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
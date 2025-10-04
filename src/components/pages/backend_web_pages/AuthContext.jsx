import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, read user info from localStorage or fetch from API
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Optionally, fetch user info from API here if token exists
      // For demo, default user role as 'teacher'
      setUser({ role: 'teacher', name: 'Demo User' });
    }
  }, []);

  // Helper to login and store user info
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Helper to logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
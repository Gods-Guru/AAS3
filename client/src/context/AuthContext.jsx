import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Helper to ensure isAdmin is always present for admin users
  const normalizeUser = (userObj) => {
    if (!userObj) return null;
    // Accept both isAdmin and role: 'admin'
    if (userObj.isAdmin !== undefined) return userObj;
    if (userObj.role && userObj.role.toLowerCase() === 'admin') {
      return { ...userObj, isAdmin: true };
    }
    return { ...userObj, isAdmin: false };
  };

  // Load user and token from localStorage (if stored)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (e) {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (userData, tokenData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
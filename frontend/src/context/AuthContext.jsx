import React, { createContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await api.getProfile(token);
          setUser(profile);
          document.documentElement.setAttribute('data-theme', profile.theme || 'light');
        } catch (error) {
          console.error("Failed to restore session:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      document.documentElement.setAttribute('data-theme', data.user.theme || 'light');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (email, password, username) => {
    try {
      const data = await api.signup(email, password, username);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      document.documentElement.setAttribute('data-theme', data.user.theme || 'light');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

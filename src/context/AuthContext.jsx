import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('snp_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get('/auth/me')
      .then((res) => setAdmin(res.data))
      .catch(() => {
        localStorage.removeItem('snp_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await client.post('/auth/register', { name, email, password });
    localStorage.setItem('snp_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('snp_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem('snp_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

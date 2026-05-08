import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, registerRequest, profileRequest } from '../api/auth.api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cp_token');
    const storedUser = localStorage.getItem('cp_user');
    if (stored && storedUser) {
      setToken(stored);
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const persist = (newToken, newUser) => {
    localStorage.setItem('cp_token', newToken);
    localStorage.setItem('cp_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async ({ correo, password }) => {
    const { data } = await loginRequest({ correo, password });
    persist(data.data.token, data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    persist(data.data.token, data.data.user);
    return data.data.user;
  };

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await profileRequest();
      setUser(data.data);
      localStorage.setItem('cp_user', JSON.stringify(data.data));
    } catch (_) {
      // Silenciar; si el token falla, el interceptor de axios redirige.
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

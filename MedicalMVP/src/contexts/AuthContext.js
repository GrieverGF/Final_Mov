import React, { createContext, useState, useContext } from 'react';
import api, { setAuthToken } from '../services/api';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'Administrador' o 'Profesional de Salud'
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role } = response.data;
      
      setAuthToken(token);
      setUser(username);
      setRole(role);
      
      return true;
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas o error de red');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

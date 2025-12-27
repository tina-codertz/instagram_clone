import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { Alert } from 'react-native';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error('Error loading user from storage:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      // Safety check: only save if token and user exist
      if (!token || !user) {
        Alert.alert('Login Failed', 'Invalid response from server');
        return false;
      }

      await AsyncStorage.multiSet([
        ['token', token],
        ['user', JSON.stringify(user)],
      ]);

      setUser(user);
      return true;
    } catch (err) {
      console.log('Login error:', err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration with:', { username, email, password });

      const res = await api.post('/auth/register', { username, email, password });
      console.log('Registration success:', res.data);

      const { token, user } = res.data;

      // Critical safety check
      if (!token || !user) {
        Alert.alert('Registration Failed', 'Invalid response from server');
        return false;
      }

      await AsyncStorage.multiSet([
        ['token', token],
        ['user', JSON.stringify(user)],
      ]);

      setUser(user);
      return true;
    } catch (err) {
      console.log('Registration error full details:', err);
      console.log('Error response:', err.response?.data);
      console.log('Status code:', err.response?.status);
      console.log('Request URL:', err.config?.url);

      Alert.alert(
        'Registration Failed',
        err.response?.data?.message ||
        err.message ||
        'Network error – check server'
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getAccountInfo = async () => {
    try {
      const res = await api.get('/users/account');
      const updatedUser = res.data;

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to fetch account info:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, getAccountInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
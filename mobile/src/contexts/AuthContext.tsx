import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure base URL for different platforms
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001'; // Android emulator
  } else {
    return 'http://localhost:3001'; // iOS simulator
  }
};

const BASE_URL = getBaseURL();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get(`${BASE_URL}/api/auth/me`);
          setUser(response.data.user);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login to:', `${BASE_URL}/api/auth/login`);
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setToken(accessToken);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed',
      };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration to:', `${BASE_URL}/api/auth/register`);
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setToken(accessToken);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      console.log('Attempting forgot password to:', `${BASE_URL}/api/auth/forgot-password`);
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      return { success: true };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Forgot password failed',
      };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      console.log('Attempting reset password to:', `${BASE_URL}/api/auth/reset-password`);
      const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, password });
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Reset password failed',
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      console.log('Attempting change password to:', `${BASE_URL}/api/auth/change-password`);
      const response = await axios.post(`${BASE_URL}/api/auth/change-password`, { currentPassword, newPassword });
      return { success: true };
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Change password failed',
      };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
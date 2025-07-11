import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; message?: string; email?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure base URL for production API
const BASE_URL = 'https://mytodo-api.dhruvchheda.com';

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
      const errorData = error.response?.data;
      if (errorData?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: errorData.email,
          error: errorData.error,
        };
      }
      return {
        success: false,
        error: errorData?.error || error.message || 'Login failed',
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

      const { user: userData, accessToken, refreshToken, requiresVerification } = response.data;

      if (requiresVerification) {
        // Registration successful but email verification required
        return {
          success: true,
          requiresVerification: true,
          message: response.data.message,
          email: userData.email,
        };
      } else {
        // Registration successful and no verification needed (shouldn't happen with new flow)
        await AsyncStorage.setItem('token', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        setUser(userData);
        setToken(accessToken);

        return { success: true };
      }
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

  const verifyEmail = async (token: string) => {
    try {
      console.log('Attempting email verification to:', `${BASE_URL}/api/auth/verify-email`);
      const response = await axios.post(`${BASE_URL}/api/auth/verify-email`, { token });

      const { user: userData, accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setToken(accessToken);

      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Email verification failed',
      };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      console.log('Attempting OTP verification to:', `${BASE_URL}/api/auth/verify-otp`);
      const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });

      const { user: userData, accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setToken(accessToken);

      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'OTP verification failed',
      };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      console.log('Attempting resend verification to:', `${BASE_URL}/api/auth/resend-verification`);
      const response = await axios.post(`${BASE_URL}/api/auth/resend-verification`, { email });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to resend verification email',
      };
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      console.log('Attempting account deletion to:', `${BASE_URL}/api/auth/delete-account`);
      const response = await axios.delete(`${BASE_URL}/api/auth/delete-account`, {
        data: {
          password,
          confirmDelete: 'DELETE',
        },
      });

      // Clear auth state after successful deletion
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);

      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Account deletion error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Account deletion failed',
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
    verifyEmail,
    verifyOTP,
    resendVerification,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
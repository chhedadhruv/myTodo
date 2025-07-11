import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get('https://mytodo-api.dhruvchheda.com/api/auth/me');
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/login', {
        email,
        password
      });

      const { user: userData, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      setToken(accessToken);
      
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: errorData.email,
          error: errorData.error
        };
      }
      return {
        success: false,
        error: errorData?.error || 'Login failed'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/register', {
        username,
        email,
        password
      });

      const { user: userData, accessToken, refreshToken, requiresVerification } = response.data;
      
      if (requiresVerification) {
        // Registration successful but email verification required
        return { 
          success: true, 
          requiresVerification: true,
          message: response.data.message,
          email: userData.email
        };
      } else {
        // Registration successful and no verification needed (shouldn't happen with new flow)
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser(userData);
        setToken(accessToken);
        
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/forgot-password', {
        email
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Password reset request failed'
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/reset-password', {
        token,
        password
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Password reset failed'
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Password change failed'
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/verify-email', {
        token
      });

      const { user: userData, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      setToken(accessToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Email verification failed'
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/verify-otp', {
        email,
        otp
      });

      const { user: userData, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      setToken(accessToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'OTP verification failed'
      };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await axios.post('https://mytodo-api.dhruvchheda.com/api/auth/resend-verification', {
        email
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to resend verification email'
      };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await axios.delete('https://mytodo-api.dhruvchheda.com/api/auth/delete-account', {
        data: {
          password,
          confirmDelete: 'DELETE'
        }
      });
      
      // Clear auth state after successful deletion
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Account deletion failed'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    verifyOTP,
    resendVerification,
    deleteAccount,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
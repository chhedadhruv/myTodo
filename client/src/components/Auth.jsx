import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  AlertCircle,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.username, formData.email, formData.password);
      }

      if (result.success) {
        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  const isEmailValid = formData.email && formData.email.includes('@');

  return (
    <div className="auth-container">
      <div className="theme-toggle" onClick={toggleTheme}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <CheckCircle size={32} />
          </div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to MyTodo to continue' 
              : 'Join MyTodo and start organizing your tasks'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {(error || success) && (
            <div className="messages-container">
              {error && (
                <div className="message error-message">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="message success-message">
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              {isEmailValid && (
                <Check size={20} className="input-validation success" />
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                {isLogin ? 'Sign in' : 'Create account'}
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="switch-link"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 
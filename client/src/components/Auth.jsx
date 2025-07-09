import React, { useState, useEffect } from 'react';
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
  Check,
  ArrowLeft
} from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot-password', 'reset-password'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    currentPassword: '',
    newPassword: ''
  });

  const { login, register, forgotPassword, resetPassword } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  // Check for reset token in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setAuthMode('reset-password');
    }
  }, []);

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

    try {
      let result;
      
      switch (authMode) {
        case 'login':
          result = await login(formData.email, formData.password);
          if (result.success) {
            setSuccess('Login successful!');
          } else {
            setError(result.error);
          }
          break;
          
        case 'register':
          // Validate passwords match for registration
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          result = await register(formData.username, formData.email, formData.password);
          if (result.success) {
            setSuccess('Registration successful!');
          } else {
            setError(result.error);
          }
          break;
          
        case 'forgot-password':
          result = await forgotPassword(formData.email);
          if (result.success) {
            setSuccess(result.message);
          } else {
            setError(result.error);
          }
          break;
          
        case 'reset-password':
          // Validate passwords match for reset
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          result = await resetPassword(resetToken, formData.password);
          if (result.success) {
            setSuccess(result.message);
            // Clear URL parameters and redirect to login after successful reset
            setTimeout(() => {
              window.history.replaceState({}, document.title, window.location.pathname);
              setAuthMode('login');
              setResetToken('');
              setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                currentPassword: '',
                newPassword: ''
              });
            }, 2000);
          } else {
            setError(result.error);
          }
          break;
          
        default:
          setError('Invalid auth mode');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
    setFormData({ 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      currentPassword: '', 
      newPassword: '' 
    });
  };

  const toggleMode = () => {
    const newMode = authMode === 'login' ? 'register' : 'login';
    switchAuthMode(newMode);
  };

  const isEmailValid = formData.email && formData.email.includes('@');

  const getAuthHeaders = () => {
    switch (authMode) {
      case 'login':
        return {
          title: 'Welcome back',
          subtitle: 'Sign in to MyTodo to continue'
        };
      case 'register':
        return {
          title: 'Create your account',
          subtitle: 'Join MyTodo and start organizing your tasks'
        };
      case 'forgot-password':
        return {
          title: 'Forgot your password?',
          subtitle: 'Enter your email address and we\'ll send you a link to reset your password'
        };
      case 'reset-password':
        return {
          title: 'Reset your password',
          subtitle: 'Enter your new password below'
        };
      default:
        return {
          title: 'Welcome',
          subtitle: 'Please sign in to continue'
        };
    }
  };

  const authHeaders = getAuthHeaders();

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
          {(authMode === 'forgot-password' || authMode === 'reset-password') && (
            <button 
              className="back-button"
              onClick={() => switchAuthMode('login')}
              type="button"
            >
              <ArrowLeft size={20} />
              Back to login
            </button>
          )}
          <h1 className="auth-title">
            {authHeaders.title}
          </h1>
          <p className="auth-subtitle">
            {authHeaders.subtitle}
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

          {/* Username field - only for registration */}
          {authMode === 'register' && (
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
                  required
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Email field - for login, register, and forgot password */}
          {(authMode === 'login' || authMode === 'register' || authMode === 'forgot-password') && (
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
          )}

          {/* Password field - for login, register, and reset password */}
          {(authMode === 'login' || authMode === 'register' || authMode === 'reset-password') && (
            <div className="form-group">
              <label className="form-label">
                {authMode === 'reset-password' ? 'New Password' : 'Password'}
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={
                    authMode === 'login' ? "Enter your password" :
                    authMode === 'register' ? "Create a password" :
                    "Enter your new password"
                  }
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
          )}

          {/* Confirm Password field - for registration and reset password */}
          {(authMode === 'register' || authMode === 'reset-password') && (
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
                  required
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

          {/* Forgot Password link - only show on login */}
          {authMode === 'login' && (
            <div className="form-group">
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => switchAuthMode('forgot-password')}
              >
                Forgot your password?
              </button>
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
                {authMode === 'login' && 'Sign in'}
                {authMode === 'register' && 'Create account'}
                {authMode === 'forgot-password' && 'Send reset link'}
                {authMode === 'reset-password' && 'Reset password'}
              </>
            )}
          </button>
        </form>

        {/* Auth switch section - only show for login/register modes */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="auth-switch">
            <p>
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="switch-link"
              >
                {authMode === 'login' ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth; 
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
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
} from './Icons';

const Auth: React.FC = () => {
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
    confirmPassword: '',
  });

  const { login, register } = useAuth();
  const { toggleTheme, isDark, colors } = useTheme();

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
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
        setError(result.error || 'Something went wrong');
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg.primary,
    },
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      right: 24,
      backgroundColor: colors.bg.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 22,
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: colors.bg.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 16,
      padding: 48,
      marginVertical: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    icon: {
      width: 64,
      height: 64,
      backgroundColor: colors.accent.primary,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    form: {
      gap: 20,
    },
    messagesContainer: {
      gap: 8,
      marginBottom: 4,
    },
    formGroup: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: 4,
    },
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: 16,
      zIndex: 2,
    },
    input: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 48,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: colors.bg.input,
      color: colors.text.primary,
      fontSize: 15,
    },
    inputFocused: {
      borderColor: colors.accent.primary,
      borderWidth: 2,
    },
    inputValidation: {
      position: 'absolute',
      right: 16,
      zIndex: 2,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      padding: 4,
      borderRadius: 4,
      zIndex: 2,
    },
    message: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    errorMessage: {
      backgroundColor: colors.status.error.bg,
      borderColor: colors.status.error.border,
    },
    successMessage: {
      backgroundColor: colors.status.success.bg,
      borderColor: colors.status.success.border,
    },
    messageText: {
      fontSize: 14,
      flex: 1,
    },
    errorMessageText: {
      color: colors.status.error.text,
    },
    successMessageText: {
      color: colors.status.success.text,
    },
    submitButton: {
      backgroundColor: colors.accent.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    switchContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    switchText: {
      color: colors.text.secondary,
      fontSize: 14,
      marginBottom: 8,
    },
    switchLink: {
      color: colors.accent.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg.primary}
      />
      
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        {isDark ? <Sun size={20} color={colors.text.secondary} /> : <Moon size={20} color={colors.text.secondary} />}
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.icon}>
              <CheckCircle size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to MyTodo to continue'
                : 'Join MyTodo and start organizing your tasks'}
            </Text>
          </View>

          <View style={styles.form}>
            {(error || success) && (
              <View style={styles.messagesContainer}>
                {error && (
                  <View style={[styles.message, styles.errorMessage]}>
                    <AlertCircle size={16} color={colors.status.error.text} />
                    <Text style={[styles.messageText, styles.errorMessageText]}>
                      {error}
                    </Text>
                  </View>
                )}

                {success && (
                  <View style={[styles.message, styles.successMessage]}>
                    <CheckCircle size={16} color={colors.status.success.text} />
                    <Text style={[styles.messageText, styles.successMessageText]}>
                      {success}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {!isLogin && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <User size={20} color={colors.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email address</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={colors.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.tertiary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailValid && (
                  <View style={styles.inputValidation}>
                    <Check size={20} color={colors.status.success.text} />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color={colors.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  placeholderTextColor={colors.text.tertiary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.text.tertiary} />
                  ) : (
                    <Eye size={20} color={colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={colors.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.text.tertiary}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={colors.text.tertiary} />
                    ) : (
                      <Eye size={20} color={colors.text.tertiary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.switchLink}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Auth; 
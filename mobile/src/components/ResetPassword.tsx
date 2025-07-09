import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from './Icons';

interface ResetPasswordProps {
  token: string;
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ 
  token, 
  onBackToLogin, 
  onResetSuccess 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { resetPassword } = useAuth();
  const { toggleTheme, isDark, colors } = useTheme();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, password);
      
      if (result.success) {
        setSuccess('Password has been successfully reset. You can now login with your new password.');
        setTimeout(() => {
          onResetSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (error) setError('');
  };

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
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      left: 24,
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
    backToLoginContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    backToLoginText: {
      color: colors.text.secondary,
      fontSize: 14,
      marginBottom: 8,
    },
    backToLoginLink: {
      color: colors.accent.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    passwordStrength: {
      marginTop: 8,
    },
    strengthText: {
      fontSize: 12,
      color: colors.text.secondary,
      marginBottom: 4,
    },
    strengthRequirement: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    strengthCheck: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.status.success.text,
    },
    strengthCross: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.status.error.text,
    },
    strengthRequirementText: {
      fontSize: 12,
      color: colors.text.tertiary,
    },
  });

  const passwordRequirements = [
    { text: 'At least 6 characters', met: password.length >= 6 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /\d/.test(password) },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg.primary}
      />
      
      <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
        <ArrowLeft size={20} color={colors.text.secondary} />
      </TouchableOpacity>

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
              <Lock size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color={colors.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your new password"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={handlePasswordChange}
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
              
              {password && (
                <View style={styles.passwordStrength}>
                  <Text style={styles.strengthText}>Password requirements:</Text>
                  {passwordRequirements.map((req, index) => (
                    <View key={index} style={styles.strengthRequirement}>
                      <View style={req.met ? styles.strengthCheck : styles.strengthCross} />
                      <Text style={styles.strengthRequirementText}>{req.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color={colors.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your new password"
                  placeholderTextColor={colors.text.tertiary}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
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

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>
              Remember your password?
            </Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.backToLoginLink}>
                Back to sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword; 
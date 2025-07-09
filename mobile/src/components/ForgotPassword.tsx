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
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Moon,
  Sun,
  Check,
} from './Icons';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { forgotPassword } = useAuth();
  const { toggleTheme, isDark, colors } = useTheme();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess('If an account with that email exists, we have sent you a password reset link.');
        setSubmitted(true);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
  };

  const isEmailValid = email && email.includes('@');

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
    inputValidation: {
      position: 'absolute',
      right: 16,
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
              <Mail size={32} color="#ffffff" />
            </View>
            <Text style={styles.title}>
              {submitted ? 'Check your email' : 'Forgot your password?'}
            </Text>
            <Text style={styles.subtitle}>
              {submitted 
                ? 'We have sent you a password reset link if an account with that email exists.'
                : 'Enter your email address and we will send you a link to reset your password.'
              }
            </Text>
          </View>

          {!submitted && (
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
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color={colors.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.text.tertiary}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  {isEmailValid && (
                    <View style={styles.inputValidation}>
                      <Check size={20} color={colors.status.success.text} />
                    </View>
                  )}
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
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

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

export default ForgotPassword; 
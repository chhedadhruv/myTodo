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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from './Icons';

interface EmailVerificationProps {
  email: string;
  onBackToLogin: () => void;
  onVerificationSuccess?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onBackToLogin,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { verifyOTP, resendVerification } = useAuth();
  const { colors } = useTheme();

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyOTP(email, otp);
      if (result.success) {
        setSuccess(result.message || 'Email verified successfully!');
        // User will be logged in after successful verification
        onVerificationSuccess?.();
      } else {
        setError(result.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await resendVerification(email);
      if (result.success) {
        setSuccess(result.message || 'Verification code sent successfully!');
      } else {
        setError(result.error || 'Failed to resend verification code');
      }
    } catch (err) {
      setError('Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg.primary,
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
      marginBottom: 8,
    },
    emailText: {
      fontSize: 16,
      color: colors.accent.primary,
      fontWeight: '600',
      textAlign: 'center',
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
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 8,
    },
    inputFocused: {
      borderColor: colors.accent.primary,
      borderWidth: 2,
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
      minHeight: 48,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    resendButton: {
      backgroundColor: 'transparent',
      borderColor: colors.accent.primary,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      marginTop: 12,
    },
    resendButtonDisabled: {
      opacity: 0.6,
    },
    resendButtonText: {
      color: colors.accent.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    instructions: {
      fontSize: 14,
      color: colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
        <ArrowLeft size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.icon}>
              <Mail size={32} color="white" />
            </View>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={styles.emailText}>{email}</Text>
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
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={colors.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor={colors.text.tertiary}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (loading || !otp || otp.length !== 6) && styles.submitButtonDisabled,
              ]}
              onPress={handleVerifyOTP}
              disabled={loading || !otp || otp.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resendButton, resendLoading && styles.resendButtonDisabled]}
              onPress={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator color={colors.accent.primary} size="small" />
              ) : (
                <Text style={styles.resendButtonText}>Resend Code</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.instructions}>
              If you don't receive the code, check your spam folder or try resending.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerification; 
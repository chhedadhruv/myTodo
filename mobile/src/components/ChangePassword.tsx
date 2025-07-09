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
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Lock,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  EyeOff,
} from './Icons';

interface ChangePasswordProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { changePassword } = useAuth();
  const { isDark, colors } = useTheme();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!currentPassword.trim()) {
      setError('Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('New password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setSuccess('Password has been successfully changed');
        resetForm();
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'currentPassword':
        setCurrentPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    if (error) setError('');
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.bg.primary,
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 20,
      maxWidth: 400,
      width: '100%',
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text.primary,
    },
    closeButton: {
      backgroundColor: colors.bg.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      maxHeight: 500,
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
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButton: {
      backgroundColor: colors.accent.primary,
    },
    cancelButton: {
      backgroundColor: colors.bg.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    cancelButtonText: {
      color: colors.text.secondary,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
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
    { text: 'At least 6 characters', met: newPassword.length >= 6 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { text: 'One number', met: /\d/.test(newPassword) },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={colors.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your current password"
                    placeholderTextColor={colors.text.tertiary}
                    value={currentPassword}
                    onChangeText={(value) => handleInputChange('currentPassword', value)}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color={colors.text.tertiary} />
                    ) : (
                      <Eye size={20} color={colors.text.tertiary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

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
                    value={newPassword}
                    onChangeText={(value) => handleInputChange('newPassword', value)}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={colors.text.tertiary} />
                    ) : (
                      <Eye size={20} color={colors.text.tertiary} />
                    )}
                  </TouchableOpacity>
                </View>
                
                {newPassword && (
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
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={colors.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your new password"
                    placeholderTextColor={colors.text.tertiary}
                    value={confirmPassword}
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
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangePassword; 
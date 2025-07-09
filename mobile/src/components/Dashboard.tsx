import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Colors, Spacing, Typography } from '../styles/variables';
import {
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Flag,
  Filter,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  X,
  Check,
  Clock,
  AlertCircle,
  Loader,
  Lock,
} from './Icons';
import ChangePassword from './ChangePassword';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed';
  due_date: string;
  created_at: string;
  updated_at: string;
}

// Custom Dropdown Component
interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  style?: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onSelect,
  placeholder = 'Select...',
  style,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          {
            backgroundColor: colors.bg.tertiary,
            borderColor: colors.border.primary,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 42,
          },
          style,
        ]}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={{
            color: selectedOption ? colors.text.primary : colors.text.tertiary,
            fontSize: 16,
            flex: 1,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={16} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: colors.bg.secondary,
              borderRadius: 12,
              padding: 16,
              width: '100%',
              maxWidth: 300,
              shadowColor: colors.shadow.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Select Option
            </Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: value === option.value ? colors.bg.tertiary : colors.bg.primary,
                  borderWidth: value === option.value ? 1 : 0,
                  borderColor: value === option.value ? colors.accent.primary : colors.border.primary,
                }}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={{
                    color: value === option.value ? colors.accent.primary : colors.text.primary,
                    fontSize: 16,
                    fontWeight: value === option.value ? '600' : '400',
                    textAlign: 'center',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, colors, toggleTheme } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerFor, setDatePickerFor] = useState<'add' | 'edit' | null>(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
  });

  // Configure base URL for different platforms
  const getBaseURL = () => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001'; // Android emulator
    } else {
      return 'http://localhost:3001'; // iOS simulator
    }
  };

  const API_BASE_URL = `${getBaseURL()}/api`;

  const apiRequest = async (endpoint: string, options: any = {}) => {
    const token = await AsyncStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest('/tasks');
      setTasks(data.tasks || []);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      setSubmitting(true);
      const data = await apiRequest('/tasks', {
        method: 'POST',
        body: taskData,
      });
      setTasks([...tasks, data.task]);
      return data.task;
    } catch (error: any) {
      setError(error.message || 'Failed to create task');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (id: string, taskData: any) => {
    try {
      setSubmitting(true);
      const data = await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: taskData,
      });
      setTasks(tasks.map((task) => (task.id === id ? data.task : task)));
      return data.task;
    } catch (error: any) {
      setError(error.message || 'Failed to update task');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error: any) {
      setError(error.message || 'Failed to delete task');
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    try {
      const data = await apiRequest(`/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      setTasks(tasks.map((task) => (task.id === id ? data.task : task)));
    } catch (error: any) {
      setError(error.message || 'Failed to toggle task status');
      throw error;
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddTask = async () => {
    if (!taskForm.title.trim() || !taskForm.due_date) return;

    try {
      await createTask(taskForm);
      setShowAddModal(false);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
      });
    } catch (error) {
      // Error is handled in createTask
    }
  };

  const handleEditTask = async () => {
    if (!editingTask || !taskForm.title.trim() || !taskForm.due_date) return;

    try {
      await updateTask(editingTask.id, taskForm);
      setShowEditModal(false);
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
      });
    } catch (error) {
      // Error is handled in updateTask
    }
  };

  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(id),
        },
      ]
    );
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskStatus(id);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
    });
  };

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleChangePassword = () => {
    setShowProfileMenu(false);
    setShowChangePasswordModal(true);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const openDatePicker = (mode: 'add' | 'edit') => {
    setDatePickerFor(mode);
    setSelectedDate(taskForm.due_date ? new Date(taskForm.due_date) : new Date());
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setTaskForm({
      ...taskForm,
      due_date: date.toISOString(),
    });
    setShowDatePicker(false);
    setDatePickerFor(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.status.error.text;
      case 'medium':
        return colors.status.warning.text;
      case 'low':
        return colors.status.success.text;
      default:
        return colors.text.secondary;
    }
  };

  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskCounts = () => {
    const total = tasks.length;
    const active = tasks.filter((task) => task.status === 'active').length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return { total, active, completed };
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case 'active':
        return task.status === 'active';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  const taskCounts = getTaskCounts();

  // Dropdown options
  const filterOptions = [
    { label: `All (${taskCounts.total})`, value: 'all' },
    { label: `Active (${taskCounts.active})`, value: 'active' },
    { label: `Completed (${taskCounts.completed})`, value: 'completed' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg.primary,
    },
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    header: {
      backgroundColor: colors.bg.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flex: 1,
    },
    appIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.accent.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appInfo: {
      flex: 1,
    },
    appTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.primary,
    },
    appSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    themeToggle: {
      backgroundColor: colors.bg.tertiary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButton: {
      backgroundColor: colors.bg.tertiary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 12,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    profileInfo: {
      alignItems: 'flex-end',
    },
    profileGreeting: {
      fontSize: 12,
      color: colors.text.tertiary,
    },
    profileName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
    },
    profileMenuContainer: {
      position: 'relative',
    },
    profileMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      shadowColor: colors.shadow.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      zIndex: 1000,
      minWidth: 160,
      marginTop: 8,
    },
    profileMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    profileMenuItemLast: {
      borderBottomWidth: 0,
    },
    profileMenuItemText: {
      fontSize: 14,
      color: colors.text.primary,
      fontWeight: '500',
    },
    profileMenuItemLogout: {
      color: colors.status.error.text,
    },
    errorBanner: {
      backgroundColor: colors.status.error.bg,
      borderColor: colors.status.error.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      margin: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    errorText: {
      color: colors.status.error.text,
      flex: 1,
    },
    errorCloseButton: {
      padding: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    },
    loadingText: {
      color: colors.text.secondary,
      fontSize: 16,
    },
    controls: {
      padding: 16,
      gap: 16,
      backgroundColor: colors.bg.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    addButton: {
      backgroundColor: colors.accent.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
      minWidth: 45,
    },
    tasksContainer: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    taskCard: {
      backgroundColor: colors.bg.secondary,
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    taskCardCompleted: {
      opacity: 0.7,
      backgroundColor: colors.bg.tertiary,
    },
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    taskCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskCheckboxCompleted: {
      backgroundColor: colors.accent.primary,
      borderColor: colors.accent.primary,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      flex: 1,
    },
    taskTitleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.text.secondary,
    },
    taskActions: {
      flexDirection: 'row',
      gap: 8,
    },
    taskActionButton: {
      padding: 6,
      backgroundColor: colors.bg.tertiary,
      borderRadius: 6,
    },
    taskActionButtonDelete: {
      backgroundColor: colors.status.error.bg,
    },
    taskDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    taskMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    taskPriority: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: colors.bg.tertiary,
    },
    taskDueDate: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    taskDueDateText: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    taskDueDateTextOverdue: {
      color: colors.status.error.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.bg.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.bg.secondary,
      borderRadius: 12,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: colors.shadow.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
    },
    modalCloseButton: {
      padding: 4,
    },
    modalForm: {
      gap: 16,
    },
    modalFormGroup: {
      gap: 8,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
    },
    modalInput: {
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.bg.input,
      color: colors.text.primary,
      fontSize: 16,
    },
    modalTextArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    modalRow: {
      flexDirection: 'row',
      gap: 12,
    },
    datePickerButton: {
      borderColor: colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.bg.input,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 42,
    },
    datePickerButtonText: {
      color: colors.text.primary,
      fontSize: 16,
      flex: 1,
      marginRight: 8,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonPrimary: {
      backgroundColor: colors.accent.primary,
    },
    modalButtonSecondary: {
      backgroundColor: colors.bg.tertiary,
      borderColor: colors.border.primary,
      borderWidth: 1,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    modalButtonTextPrimary: {
      color: '#ffffff',
    },
    modalButtonTextSecondary: {
      color: colors.text.primary,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.safeArea}>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.bg.primary}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.primary} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeArea}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.bg.primary}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.appIcon}>
              <CheckCircle size={24} color="#ffffff" />
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appTitle}>MyTodo</Text>
              <Text style={styles.appSubtitle}>{getGreeting()}, {user?.username}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              {isDark ? (
                <Sun size={20} color={colors.text.secondary} />
              ) : (
                <Moon size={20} color={colors.text.secondary} />
              )}
            </TouchableOpacity>
            <View style={styles.profileMenuContainer}>
              <TouchableOpacity style={styles.profileButton} onPress={handleProfileMenuToggle}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileGreeting}>Signed in as</Text>
                  <Text style={styles.profileName}>{user?.username}</Text>
                </View>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {showProfileMenu && (
                <View style={styles.profileMenu}>
                  <TouchableOpacity 
                    style={styles.profileMenuItem}
                    onPress={handleChangePassword}
                  >
                    <Lock size={16} color={colors.text.secondary} />
                    <Text style={styles.profileMenuItemText}>Change Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.profileMenuItem, styles.profileMenuItemLast]}
                    onPress={handleLogout}
                  >
                    <LogOut size={16} color={colors.status.error.text} />
                    <Text style={[styles.profileMenuItemText, styles.profileMenuItemLogout]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={colors.status.error.text} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.errorCloseButton}
              onPress={() => setError(null)}
            >
              <X size={16} color={colors.status.error.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add New Task</Text>
          </TouchableOpacity>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Filter:</Text>
            <CustomDropdown
              value={filter}
              options={filterOptions}
              onSelect={(value) => setFilter(value as any)}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksContainer}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No tasks found</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all'
                  ? 'Create your first task to get started!'
                  : filter === 'active'
                  ? 'All tasks are completed!'
                  : 'No completed tasks yet.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={[styles.taskCard, item.status === 'completed' && styles.taskCardCompleted]}>
                  <View style={styles.taskHeader}>
                    <TouchableOpacity
                      style={[
                        styles.taskCheckbox,
                        item.status === 'completed' && styles.taskCheckboxCompleted,
                      ]}
                      onPress={() => handleToggleComplete(item.id)}
                    >
                      {item.status === 'completed' && <Check size={16} color="#ffffff" />}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.taskTitle,
                        item.status === 'completed' && styles.taskTitleCompleted,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={styles.taskActionButton}
                        onPress={() => openEditModal(item)}
                      >
                        <Edit2 size={16} color={colors.text.secondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.taskActionButton, styles.taskActionButtonDelete]}
                        onPress={() => handleDeleteTask(item.id)}
                      >
                        <Trash2 size={16} color={colors.status.error.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {item.description && (
                    <Text style={styles.taskDescription}>{item.description}</Text>
                  )}
                  
                  <View style={styles.taskMeta}>
                    <View
                      style={[
                        styles.taskPriority,
                        { backgroundColor: colors.bg.tertiary },
                      ]}
                    >
                      <Text style={{ color: getPriorityColor(item.priority) }}>
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.taskDueDate}>
                      <Calendar size={12} color={colors.text.secondary} />
                      <Text
                        style={[
                          styles.taskDueDateText,
                          isTaskOverdue(item.due_date) && styles.taskDueDateTextOverdue,
                        ]}
                      >
                        {formatDate(item.due_date)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Add Task Modal */}
        <Modal
          visible={showAddModal}
          transparent
          animationType="fade"
          onRequestClose={closeModals}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Task</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModals}
                >
                  <X size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalForm}>
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalLabel}>Title</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter task title"
                    placeholderTextColor={colors.text.tertiary}
                    value={taskForm.title}
                    onChangeText={(text) => setTaskForm({ ...taskForm, title: text })}
                  />
                </View>
                
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalTextArea]}
                    placeholder="Enter task description"
                    placeholderTextColor={colors.text.tertiary}
                    value={taskForm.description}
                    onChangeText={(text) => setTaskForm({ ...taskForm, description: text })}
                    multiline
                  />
                </View>
                
                <View style={styles.modalRow}>
                  <View style={[styles.modalFormGroup, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Priority</Text>
                    <CustomDropdown
                      value={taskForm.priority}
                      options={priorityOptions}
                      onSelect={(value) => setTaskForm({ ...taskForm, priority: value as any })}
                    />
                  </View>
                  
                  <View style={[styles.modalFormGroup, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Due Date & Time</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => openDatePicker('add')}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {taskForm.due_date ? formatDate(taskForm.due_date) : 'Select Date & Time'}
                      </Text>
                      <Calendar size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={closeModals}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleAddTask}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                      Add Task
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          visible={showEditModal}
          transparent
          animationType="fade"
          onRequestClose={closeModals}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Task</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModals}
                >
                  <X size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalForm}>
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalLabel}>Title</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter task title"
                    placeholderTextColor={colors.text.tertiary}
                    value={taskForm.title}
                    onChangeText={(text) => setTaskForm({ ...taskForm, title: text })}
                  />
                </View>
                
                <View style={styles.modalFormGroup}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalTextArea]}
                    placeholder="Enter task description"
                    placeholderTextColor={colors.text.tertiary}
                    value={taskForm.description}
                    onChangeText={(text) => setTaskForm({ ...taskForm, description: text })}
                    multiline
                  />
                </View>
                
                <View style={styles.modalRow}>
                  <View style={[styles.modalFormGroup, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Priority</Text>
                    <CustomDropdown
                      value={taskForm.priority}
                      options={priorityOptions}
                      onSelect={(value) => setTaskForm({ ...taskForm, priority: value as any })}
                    />
                  </View>
                  
                  <View style={[styles.modalFormGroup, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Due Date & Time</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => openDatePicker('edit')}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {taskForm.due_date ? formatDate(taskForm.due_date) : 'Select Date & Time'}
                      </Text>
                      <Calendar size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={closeModals}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleEditTask}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                      Update Task
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Date Picker Modal */}
        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate}
          mode="datetime"
          onConfirm={handleDateSelect}
          onCancel={() => {
            setShowDatePicker(false);
            setDatePickerFor(null);
          }}
        />

        {/* Change Password Modal */}
        <ChangePassword
          visible={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
          onSuccess={() => {
            Alert.alert('Success', 'Password changed successfully!');
            setShowChangePasswordModal(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  Eye,
  EyeOff
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, changePassword } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // API utility functions
  const API_BASE_URL = 'http://localhost:3001/api';

  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
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
    } catch (error) {
      setError(error.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setSubmitting(true);
      const data = await apiRequest('/tasks', {
        method: 'POST',
        body: taskData
      });
      setTasks([...tasks, data.task]);
      return data.task;
    } catch (error) {
      setError(error.message || 'Failed to create task');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setSubmitting(true);
      const data = await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: taskData
      });
      setTasks(tasks.map(task => 
        task.id === id ? data.task : task
      ));
      return data.task;
    } catch (error) {
      setError(error.message || 'Failed to update task');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete task');
      throw error;
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const data = await apiRequest(`/tasks/${id}/toggle`, {
        method: 'PATCH'
      });
      setTasks(tasks.map(task => 
        task.id === id ? data.task : task
      ));
    } catch (error) {
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
      await createTask({
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        due_date: taskForm.due_date
      });
      
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowAddModal(false);
      setError(null);
    } catch (error) {
      // Error is already handled in createTask
    }
  };

  const handleEditTask = async () => {
    if (!taskForm.title.trim() || !taskForm.due_date) return;
    
    try {
      await updateTask(editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        due_date: taskForm.due_date
      });
      
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowEditModal(false);
      setEditingTask(null);
      setError(null);
    } catch (error) {
      // Error is already handled in updateTask
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleToggleComplete = async (id) => {
    await toggleTaskStatus(id);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? task.due_date.slice(0, 16) : ''
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowChangePasswordModal(false);
    setEditingTask(null);
    setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
    setError(null);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeLoading(true);
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      setPasswordChangeLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (result.success) {
        setPasswordChangeSuccess(result.message);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setPasswordChangeSuccess('');
        }, 2000);
      } else {
        setPasswordChangeError(result.error);
      }
    } catch (error) {
      setPasswordChangeError('Something went wrong. Please try again.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const openChangePasswordModal = () => {
    setShowProfileDropdown(false);
    setShowChangePasswordModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status === 'active';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-tertiary)';
    }
  };

  const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show full date and time
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const getTaskCounts = () => {
    const total = tasks.length;
    const active = tasks.filter(t => t.status === 'active').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return { total, active, completed };
  };

  const { total, active, completed } = getTaskCounts();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="app-icon">
            <CheckCircle size={28} />
          </div>
          <div className="app-info">
            <h1 className="app-title">MyTodo</h1>
            <p className="app-subtitle">Stay Organized</p>
          </div>
        </div>

        <div className="header-right">
          <div className="dashboard-theme-toggle" onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </div>

          <div className="profile-dropdown">
            <div 
              className="profile-avatar"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <User size={18} />
              <div className="profile-info">
                <span className="profile-greeting">{getGreeting()}</span>
                <span className="profile-name">{user?.username}</span>
              </div>
              <ChevronDown size={16} className={`chevron ${showProfileDropdown ? 'open' : ''}`} />
            </div>

            {showProfileDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={openChangePasswordModal}>
                  <Lock size={16} />
                  <span>Change Password</span>
                </div>
                <div className="dropdown-item" onClick={logout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Controls */}
        <div className="dashboard-controls">
          <button 
            className="add-task-btn"
            onClick={() => setShowAddModal(true)}
            disabled={submitting}
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>

          <div className="filter-controls">
            <Filter size={18} />
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({total})
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({active})
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({completed})
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-state">
            <Loader size={32} className="spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : (
          /* Tasks List */
          <div className="tasks-container">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} />
                <h3>No tasks found</h3>
                <p>
                  {filter === 'all' 
                    ? "You don't have any tasks yet. Create your first task!"
                    : `No ${filter} tasks found.`
                  }
                </p>
              </div>
            ) : (
              <div className="tasks-grid">
                {filteredTasks.map(task => (
                  <div key={task.id} className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
                    <div className="task-header">
                      <div className="task-status">
                        <button 
                          className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                          onClick={() => handleToggleComplete(task.id)}
                        >
                          {task.status === 'completed' && <Check size={14} />}
                        </button>
                        <div className="task-title-container">
                          <h3 className="task-title">{task.title}</h3>
                          {task.description && (
                            <p className="task-description">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <button 
                          className="task-action-btn"
                          onClick={() => openEditModal(task)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="task-action-btn delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="task-meta">
                      <div className="task-priority">
                        <Flag size={14} style={{ color: getPriorityColor(task.priority) }} />
                        <span style={{ color: getPriorityColor(task.priority) }}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                      
                      <div className={`task-due-date ${isTaskOverdue(task.due_date) ? 'overdue' : ''}`}>
                        {isTaskOverdue(task.due_date) ? (
                          <AlertCircle size={14} />
                        ) : (
                          <Calendar size={14} />
                        )}
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="dashboard-form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>

              <div className="dashboard-form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Enter task description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                />
              </div>

              <div className="dashboard-form-row">
                <div className="dashboard-form-group">
                  <label>Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label>Due Date & Time</label>
                  <input
                    type="datetime-local"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModals} disabled={submitting}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddTask} disabled={submitting || !taskForm.title.trim() || !taskForm.due_date}>
                {submitting ? (
                  <>
                    <Loader size={16} className="spinner" />
                    Adding...
                  </>
                ) : (
                  'Add Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="modal-close" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="dashboard-form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>

              <div className="dashboard-form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Enter task description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                />
              </div>

              <div className="dashboard-form-row">
                <div className="dashboard-form-group">
                  <label>Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label>Due Date & Time</label>
                  <input
                    type="datetime-local"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModals} disabled={submitting}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleEditTask} disabled={submitting || !taskForm.title.trim() || !taskForm.due_date}>
                {submitting ? (
                  <>
                    <Loader size={16} className="spinner" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                {/* Messages */}
                {(passwordChangeError || passwordChangeSuccess) && (
                  <div className="messages-container">
                    {passwordChangeError && (
                      <div className="message error-message">
                        <AlertCircle size={16} />
                        {passwordChangeError}
                      </div>
                    )}
                    {passwordChangeSuccess && (
                      <div className="message success-message">
                        <CheckCircle size={16} />
                        {passwordChangeSuccess}
                      </div>
                    )}
                  </div>
                )}

                <div className="dashboard-form-group">
                  <label>Current Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="dashboard-form-group">
                  <label>New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="password-requirements">
                    Password must be at least 6 characters long and contain uppercase, lowercase, and numbers.
                  </p>
                </div>

                <div className="dashboard-form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
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
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={closeModals} 
                  disabled={passwordChangeLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={passwordChangeLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  {passwordChangeLoading ? (
                    <>
                      <Loader size={16} className="spinner" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
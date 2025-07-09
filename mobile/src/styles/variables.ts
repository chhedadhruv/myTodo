// Theme variables for React Native
export const theme = {
  colors: {
    // Color Palette
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    purple: {
      400: '#a855f7',
      500: '#9333ea',
      600: '#7c3aed',
    },
    green: {
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
    },
    red: {
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
    },
    yellow: {
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
    },
  },
  
  dark: {
    // Backgrounds
    bg: {
      primary: '#0a0a0a',
      secondary: 'rgba(20, 20, 23, 0.8)',
      tertiary: 'rgba(30, 30, 35, 0.6)',
      input: 'rgba(25, 25, 30, 0.8)',
      hover: 'rgba(255, 255, 255, 0.05)',
      active: 'rgba(255, 255, 255, 0.1)',
    },
    
    // Text Colors
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
      muted: '#52525b',
    },
    
    // Accent Colors
    accent: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      tertiary: '#06b6d4',
      primaryAlpha: 'rgba(59, 130, 246, 0.2)',
    },
    
    // Border Colors
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      focus: '#3b82f6',
    },
    
    // Shadow Colors
    shadow: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.8)',
    },
    
    // Status Colors
    status: {
      success: {
        bg: 'rgba(34, 197, 94, 0.1)',
        text: '#4ade80',
        border: 'rgba(34, 197, 94, 0.2)',
      },
      error: {
        bg: 'rgba(239, 68, 68, 0.1)',
        text: '#f87171',
        border: 'rgba(239, 68, 68, 0.2)',
      },
      warning: {
        bg: 'rgba(234, 179, 8, 0.1)',
        text: '#facc15',
        border: 'rgba(234, 179, 8, 0.2)',
      },
      info: {
        bg: 'rgba(59, 130, 246, 0.1)',
        text: '#60a5fa',
        border: 'rgba(59, 130, 246, 0.2)',
      },
    },
    
    // Priority Colors
    priority: {
      low: '#4ade80',
      medium: '#facc15',
      high: '#f87171',
      lowBg: 'rgba(74, 222, 128, 0.1)',
      mediumBg: 'rgba(250, 204, 21, 0.1)',
      highBg: 'rgba(248, 113, 113, 0.1)',
    },
  },
  
  light: {
    // Backgrounds
    bg: {
      primary: '#ffffff',
      secondary: 'rgba(248, 250, 252, 0.8)',
      tertiary: 'rgba(241, 245, 249, 0.6)',
      input: 'rgba(255, 255, 255, 0.9)',
      hover: 'rgba(0, 0, 0, 0.04)',
      active: 'rgba(0, 0, 0, 0.08)',
    },
    
    // Text Colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      muted: '#94a3b8',
    },
    
    // Accent Colors
    accent: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      tertiary: '#0891b2',
      primaryAlpha: 'rgba(37, 99, 235, 0.15)',
    },
    
    // Border Colors
    border: {
      primary: 'rgba(0, 0, 0, 0.1)',
      secondary: 'rgba(0, 0, 0, 0.05)',
      focus: '#2563eb',
    },
    
    // Shadow Colors
    shadow: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.3)',
    },
    
    // Status Colors
    status: {
      success: {
        bg: 'rgba(34, 197, 94, 0.08)',
        text: '#16a34a',
        border: 'rgba(34, 197, 94, 0.15)',
      },
      error: {
        bg: 'rgba(239, 68, 68, 0.08)',
        text: '#dc2626',
        border: 'rgba(239, 68, 68, 0.15)',
      },
      warning: {
        bg: 'rgba(234, 179, 8, 0.08)',
        text: '#ca8a04',
        border: 'rgba(234, 179, 8, 0.15)',
      },
      info: {
        bg: 'rgba(59, 130, 246, 0.08)',
        text: '#2563eb',
        border: 'rgba(59, 130, 246, 0.15)',
      },
    },
    
    // Priority Colors
    priority: {
      low: '#16a34a',
      medium: '#ca8a04',
      high: '#dc2626',
      lowBg: 'rgba(34, 197, 94, 0.08)',
      mediumBg: 'rgba(234, 179, 8, 0.08)',
      highBg: 'rgba(239, 68, 68, 0.08)',
    },
  },
  
  // Common values
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 999,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;

// Export commonly used values
export const Colors = theme.colors;
export const Spacing = theme.spacing;
export const Typography = theme.fontSize;
export const BorderRadius = theme.borderRadius;
export const Shadows = theme.shadows; 
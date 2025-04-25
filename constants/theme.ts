import { Platform } from 'react-native';

// Font families
export const FONTS = {
  regular: Platform.select({
    ios: 'Poppins-Regular',
    android: 'Poppins-Regular',
    default: 'Poppins-Regular'
  }),
  medium: Platform.select({
    ios: 'Poppins-Medium',
    android: 'Poppins-Medium',
    default: 'Poppins-Medium'
  }),
  semiBold: Platform.select({
    ios: 'Poppins-SemiBold',
    android: 'Poppins-SemiBold',
    default: 'Poppins-SemiBold'
  }),
  // Arabic fonts
  arRegular: Platform.select({
    ios: 'Cairo-Regular',
    android: 'Cairo-Regular',
    default: 'Cairo-Regular'
  }),
  arMedium: Platform.select({
    ios: 'Cairo-Medium',
    android: 'Cairo-Medium',
    default: 'Cairo-Medium'
  }),
  arSemiBold: Platform.select({
    ios: 'Cairo-SemiBold',
    android: 'Cairo-SemiBold',
    default: 'Cairo-SemiBold'
  })
};

// Colors
export const COLORS = {
  // Primary
  primary: {
    50: '#E6F5EC',
    100: '#C4E8D3',
    200: '#9DD9B7',
    300: '#75C99B',
    400: '#55BC86',
    500: '#35AF71', // Main primary color
    600: '#2F9D63',
    700: '#278753',
    800: '#207144',
    900: '#194D36',
  },
  // Secondary
  secondary: {
    50: '#EFEDF8',
    100: '#D9D2EF',
    200: '#BEB4E5',
    300: '#A496DA',
    400: '#907CD2',
    500: '#7C62CA', // Main secondary color
    600: '#7058BA',
    700: '#644BA5',
    800: '#583E91',
    900: '#4C326D',
  },
  // Accent
  accent: {
    50: '#FFF4E5',
    100: '#FFE4BF',
    200: '#FFD394',
    300: '#FFC169',
    400: '#FFB347',
    500: '#FFA726', // Main accent color
    600: '#FF9A00',
    700: '#FF8C00',
    800: '#FF7D00',
    900: '#FF6F00',
  },
  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Status colors
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#065F46',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#92400E',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#B91C1C',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1E40AF',
  },
};

// Light theme
export const lightTheme = {
  colors: {
    primary: COLORS.primary[500],
    background: COLORS.white,
    card: COLORS.white,
    text: COLORS.gray[900],
    secondaryText: COLORS.gray[600],
    border: COLORS.gray[200],
    notification: COLORS.accent[500],
    shadow: 'rgba(0, 0, 0, 0.1)',
    inputBackground: COLORS.gray[50],
    surfaceElevated: COLORS.white,
    ...COLORS,
  },
};

// Dark theme
export const darkTheme = {
  colors: {
    primary: COLORS.primary[400],
    background: COLORS.gray[900],
    card: COLORS.gray[800],
    text: COLORS.white,
    secondaryText: COLORS.gray[300],
    border: COLORS.gray[700],
    notification: COLORS.accent[400],
    shadow: 'rgba(0, 0, 0, 0.3)',
    inputBackground: COLORS.gray[800],
    surfaceElevated: COLORS.gray[800],
    ...COLORS,
  },
};

// Spacing system (8px)
export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
};

// Border radius
export const BORDER_RADIUS = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Font sizes
export const FONT_SIZE = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

// Line heights
export const LINE_HEIGHT = {
  xs: 18,
  s: 20,
  m: 24,
  l: 28,
  xl: 30,
  xxl: 36,
  xxxl: 48,
  display: 52,
};

export default {
  FONTS,
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_SIZE,
  LINE_HEIGHT,
  lightTheme,
  darkTheme,
};
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  icon,
  style,
  textStyle,
  ...rest
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  // Button size styles
  const sizeStyles: Record<string, { button: ViewStyle; text: TextStyle }> = {
    small: {
      button: { height: 36, paddingHorizontal: SPACING.m },
      text: { fontSize: 14 },
    },
    medium: {
      button: { height: 48, paddingHorizontal: SPACING.l },
      text: { fontSize: 16 },
    },
    large: {
      button: { height: 56, paddingHorizontal: SPACING.xl },
      text: { fontSize: 18 },
    },
  };

  // Button variant styles
  const variantStyles: Record<string, { button: ViewStyle; text: TextStyle }> = {
    primary: {
      button: {
        backgroundColor: COLORS.primary[500],
      },
      text: {
        color: COLORS.white,
      },
    },
    secondary: {
      button: {
        backgroundColor: COLORS.secondary[500],
      },
      text: {
        color: COLORS.white,
      },
    },
    outline: {
      button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary[500],
      },
      text: {
        color: COLORS.primary[500],
      },
    },
    text: {
      button: {
        backgroundColor: 'transparent',
      },
      text: {
        color: COLORS.primary[500],
      },
    },
    danger: {
      button: {
        backgroundColor: COLORS.error.main,
      },
      text: {
        color: COLORS.white,
      },
    },
  };

  // Combined styles
  const buttonStyles = [
    styles.button,
    variantStyles[variant].button,
    sizeStyles[size].button,
    isDisabled && styles.disabledButton,
    isDark && variant === 'outline' && { borderColor: COLORS.primary[400] },
    isDark && variant === 'text' && { backgroundColor: 'transparent' },
    style,
  ];

  const textStyles = [
    styles.text,
    { fontFamily: isRTL ? FONTS.arMedium : FONTS.medium },
    variantStyles[variant].text,
    sizeStyles[size].text,
    isDisabled && styles.disabledText,
    isDark && variant === 'outline' && { color: COLORS.primary[400] },
    isDark && variant === 'text' && { color: COLORS.primary[400] },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? COLORS.primary[500] : COLORS.white}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.m,
    gap: SPACING.s,
  },
  text: {
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray[300],
    borderColor: COLORS.gray[300],
  },
  disabledText: {
    color: COLORS.gray[600],
  },
});

export default Button;
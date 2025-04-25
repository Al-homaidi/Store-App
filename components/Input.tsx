import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPasswordInput?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  isPasswordInput = false,
  ...rest
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const backgroundColor = isDark ? COLORS.gray[800] : COLORS.gray[50];
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const placeholderColor = isDark ? COLORS.gray[500] : COLORS.gray[400];
  const borderColor = error
    ? COLORS.error.main
    : isFocused
    ? COLORS.primary[500]
    : isDark
    ? COLORS.gray[700]
    : COLORS.gray[300];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const passwordIcon = (
    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      {isPasswordVisible ? (
        <EyeOff size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />
      ) : (
        <Eye size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isDark ? COLORS.gray[300] : COLORS.gray[700],
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              textAlign: isRTL ? 'right' : 'left',
            },
            inputStyle,
          ]}
          placeholderTextColor={placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPasswordInput && !isPasswordVisible}
          {...rest}
        />
        {isPasswordInput && passwordIcon}
        {rightIcon && !isPasswordInput && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            {
              fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    marginBottom: SPACING.xs,
    fontSize: 14,
  },
  inputContainer: {
    height: 48,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.m,
  },
  iconContainer: {
    paddingHorizontal: SPACING.m,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: COLORS.error.main,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});

export default Input;
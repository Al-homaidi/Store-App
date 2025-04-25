import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightAction,
  style,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  
  const handleBack = () => {
    router.back();
  };
  
  const BackButton = () => (
    <TouchableOpacity 
      onPress={handleBack} 
      style={styles.backButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {isRTL ? (
        <ChevronRight size={24} color={textColor} />
      ) : (
        <ChevronLeft size={24} color={textColor} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.leadingContainer}>
        {showBackButton && <BackButton />}
      </View>
      
      <Text 
        style={[
          styles.title, 
          { 
            color: textColor,
            fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold 
          }
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      <View style={styles.trailingContainer}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  leadingContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  trailingContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default Header;
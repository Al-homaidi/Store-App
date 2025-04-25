import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle, Platform, StatusBar } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/theme';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  disableTop?: boolean;
  disableBottom?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
  disableTop = false,
  disableBottom = false,
  edges,
}) => {
  const { isDark } = useTheme();
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;

  // Calculate padding for web or Android
  const paddingTop = Platform.OS === 'web' || Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView 
      style={[
        styles.safeAreaContainer, 
        { backgroundColor },
        !disableTop && Platform.OS !== 'ios' && { paddingTop },
        style
      ]}
    >
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default SafeAreaContainer;
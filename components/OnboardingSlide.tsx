import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ViewStyle } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
  index: number;
  translateX: Animated.SharedValue<number>;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
  index,
  translateX,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const descriptionColor = isDark ? COLORS.gray[300] : COLORS.gray[600];

  const rImageAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      translateX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const rTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [(index - 0.5) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 0.5) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      translateX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [50, 0, 50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <Animated.View style={[styles.imageContainer, rImageAnimatedStyle]}>
        <Image source={{ uri: image }} style={styles.image} />
      </Animated.View>

      <Animated.View style={[styles.textContainer, rTextAnimatedStyle]}>
        <Text 
          style={[
            styles.title, 
            { 
              color: textColor,
              fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}
        >
          {title}
        </Text>
        <Text 
          style={[
            styles.description, 
            { 
              color: descriptionColor,
              fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}
        >
          {description}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.xl,
  },
  title: {
    fontSize: 28,
    marginBottom: SPACING.m,
    width: '100%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    width: '100%',
  },
});

export default OnboardingSlide;
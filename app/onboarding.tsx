import React, { useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import OnboardingSlide from '@/components/OnboardingSlide';
import Button from '@/components/Button';

const OnboardingScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const currentIndex = useRef(0);
  
  const slides = [
    {
      id: '1',
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
      image: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
      image: 'https://images.pexels.com/photos/1005715/pexels-photo-1005715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
      image: 'https://images.pexels.com/photos/2447043/pexels-photo-2447043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];
  
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const handleNextSlide = () => {
    if (currentIndex.current < slides.length - 1) {
      currentIndex.current += 1;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };
  
  const handleGetStarted = async () => {
    try {
      await SecureStore.setItemAsync('onboardingComplete', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      router.replace('/(tabs)');
    }
  };
  
  const nextButtonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH * (slides.length - 1)],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    const display = opacity === 0 ? 'none' : 'flex';
    
    return {
      opacity,
      display,
    };
  });
  
  const getStartedButtonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH * (slides.length - 2), SCREEN_WIDTH * (slides.length - 1)],
      [0, 0, 1],
      Extrapolate.CLAMP
    );
    
    const display = opacity === 0 ? 'none' : 'flex';
    
    return {
      opacity,
      display,
    };
  });
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            title={item.title}
            description={item.description}
            image={item.image}
            index={index}
            translateX={scrollX}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
      />
      
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {slides.map((_, index) => (
            <PaginationDot
              key={index}
              index={index}
              scrollX={scrollX}
              screenWidth={SCREEN_WIDTH}
            />
          ))}
        </View>
        
        <View style={styles.buttonsContainer}>
          <Animated.View style={[styles.buttonContainer, nextButtonAnimatedStyle]}>
            <Button
              title={t('common.next')}
              onPress={handleNextSlide}
              variant="primary"
              size="large"
              style={styles.button}
            />
          </Animated.View>
          
          <Animated.View style={[styles.buttonContainer, getStartedButtonAnimatedStyle]}>
            <Button
              title={t('onboarding.getStarted')}
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              style={styles.button}
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaContainer>
  );
};

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  screenWidth: number;
}

const PaginationDot: React.FC<PaginationDotProps> = ({ index, scrollX, screenWidth }) => {
  const dotAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];
    
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 20, 8],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    
    return {
      width,
      opacity,
    };
  });
  
  return <Animated.View style={[styles.dot, dotAnimatedStyle]} />;
};

const styles = StyleSheet.create({
  paginationContainer: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary[500],
    marginHorizontal: 4,
  },
  buttonsContainer: {
    position: 'relative',
    height: 56,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  button: {
    borderRadius: BORDER_RADIUS.round,
  },
});

export default OnboardingScreen;
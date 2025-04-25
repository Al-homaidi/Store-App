import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useOrderStore } from '@/store/useOrderStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Button from '@/components/Button';
import { Check, Home, Package } from 'lucide-react-native';

export default function CheckoutSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { getOrderById } = useOrderStore();
  
  const order = getOrderById(orderId);
  
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate elements sequentially
    checkmarkScale.value = withDelay(
      300,
      withSpring(1, { damping: 12 })
    );
    
    checkmarkOpacity.value = withDelay(
      300,
      withSpring(1)
    );
    
    textOpacity.value = withDelay(
      800,
      withSpring(1)
    );
    
    buttonsOpacity.value = withDelay(
      1200,
      withSpring(1)
    );
  }, []);
  
  const checkmarkContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
      opacity: checkmarkOpacity.value,
    };
  });
  
  const textContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        {
          translateY: withSequence(
            withSpring(20, { damping: 100 }),
            withSpring(0, { damping: 15 })
          ),
        },
      ],
    };
  });
  
  const buttonsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonsOpacity.value,
    };
  });
  
  const handleContinueShopping = () => {
    router.push('/');
  };
  
  const handleViewOrder = () => {
    router.push('/orders');
  };
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  
  return (
    <SafeAreaContainer style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkmarkContainer, checkmarkContainerStyle]}>
          <View
            style={[
              styles.checkmark,
              { backgroundColor: COLORS.success.main },
            ]}
          >
            <Check size={40} color={COLORS.white} strokeWidth={3} />
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, textContainerStyle]}>
          <Text
            style={[
              styles.title,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
              },
            ]}
          >
            {t('checkout.success.title')}
          </Text>
          
          <Text
            style={[
              styles.message,
              {
                color: secondaryTextColor,
                fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              },
            ]}
          >
            {t('checkout.success.message')}
          </Text>
          
          <Text
            style={[
              styles.orderNumber,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              },
            ]}
          >
            {t('orders.orderNumber')}: {orderId?.slice(-8)}
          </Text>
        </Animated.View>
        
        <Animated.View style={[styles.buttonsContainer, buttonsContainerStyle]}>
          <Button
            title={t('checkout.success.viewOrder')}
            onPress={handleViewOrder}
            variant="outline"
            icon={<Package size={20} color={COLORS.primary[isDark ? 400 : 500]} />}
            style={styles.button}
          />
          
          <Button
            title={t('checkout.success.continueShopping')}
            onPress={handleContinueShopping}
            icon={<Home size={20} color={COLORS.white} />}
            style={styles.button}
          />
        </Animated.View>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  checkmarkContainer: {
    marginBottom: SPACING.xl,
  },
  checkmark: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  orderNumber: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    marginBottom: SPACING.m,
  },
});
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useOrderStore } from '@/store/useOrderStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import { ShoppingBag } from 'lucide-react-native';

export default function CartScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { addOrder } = useOrderStore();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPrice = getTotalPrice();
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const surfaceColor = isDark ? COLORS.gray[800] : COLORS.white;
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        t('cart.loginRequired'),
        '',
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('auth.login'),
            onPress: () => router.push('/auth'),
          },
        ],
        { cancelable: true }
      );
      return;
    }
    
    setIsLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      // Create order
      const order = addOrder(items, totalPrice);
      
      // Clear cart
      clearCart();
      
      // Navigate to checkout success
      router.push(`/checkout/success?orderId=${order.id}`);
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleContinueShopping = () => {
    router.push('/');
  };
  
  if (items.length === 0) {
    return (
      <SafeAreaContainer style={{ backgroundColor }}>
        <Header title={t('cart.title')} />
        
        <View style={styles.emptyContainer}>
          <Animated.View
            entering={FadeIn.duration(800)}
            style={styles.emptyIconContainer}
          >
            <ShoppingBag size={80} color={COLORS.gray[300]} />
          </Animated.View>
          
          <Text
            style={[
              styles.emptyText,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              },
            ]}
          >
            {t('cart.empty')}
          </Text>
          
          <Button
            title={t('cart.startShopping')}
            onPress={handleContinueShopping}
            style={styles.continueButton}
          />
        </View>
      </SafeAreaContainer>
    );
  }
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={t('cart.title')} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View layout={Layout.springify()}>
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </Animated.View>
      </ScrollView>
      
      <Animated.View
        style={[
          styles.totalContainer,
          {
            backgroundColor: surfaceColor,
            borderTopColor: borderColor,
          },
        ]}
        entering={FadeIn}
        exiting={FadeOut}
        layout={Layout.springify()}
      >
        <View style={styles.totalRow}>
          <Text
            style={[
              styles.totalLabel,
              {
                color: isDark ? COLORS.gray[300] : COLORS.gray[600],
                fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              },
            ]}
          >
            {t('cart.total')}
          </Text>
          <Text
            style={[
              styles.totalValue,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
              },
            ]}
          >
            {formatPrice(totalPrice)}
          </Text>
        </View>
        
        <Button
          title={t('cart.checkout')}
          onPress={handleCheckout}
          size="large"
          isLoading={isLoading}
          style={styles.checkoutButton}
        />
      </Animated.View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  emptyIconContainer: {
    marginBottom: SPACING.l,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: SPACING.l,
  },
  continueButton: {
    width: '80%',
  },
  totalContainer: {
    padding: SPACING.l,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 24,
  },
  checkoutButton: {
    borderRadius: BORDER_RADIUS.m,
  },
});
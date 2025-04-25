import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { ShoppingCart, Check, Heart } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { getProductById } = useProductStore();
  const { addItem, items } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  
  const product = getProductById(Number(id));
  const isInCart = items.some((item) => item.product.id === Number(id));
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const imageScale = useSharedValue(1);
  const addButtonScale = useSharedValue(1);
  const addedToCartOpacity = useSharedValue(0);
  
  const handleAddToCart = () => {
    addButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    imageScale.value = withSequence(
      withTiming(1.05, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
    
    setIsAddingToCart(true);
    
    // Add to cart and show confirmation UI
    setTimeout(() => {
      if (product) {
        addItem(product);
      }
      
      addedToCartOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      
      // Hide confirmation after 2 seconds
      setTimeout(() => {
        addedToCartOpacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.ease),
        });
        setIsAddingToCart(false);
      }, 2000);
    }, 500);
  };
  
  const handleGoToCart = () => {
    router.push('/cart');
  };
  
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));
  
  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));
  
  const addedToCartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addedToCartOpacity.value,
    transform: [
      {
        translateY: interpolate(
          addedToCartOpacity.value,
          [0, 1],
          [20, 0]
        ),
      },
    ],
  }));
  
  if (!product) {
    return (
      <SafeAreaContainer>
        <Header title={t('product.notFound')} />
        <View style={styles.centerContainer}>
          <Text>{t('product.notFoundMessage')}</Text>
        </View>
      </SafeAreaContainer>
    );
  }
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const surfaceColor = isDark ? COLORS.gray[800] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={product.name} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              { backgroundColor: surfaceColor },
              isDark ? null : SHADOWS.small,
            ]}
          >
            <Heart size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.detailsContainer,
            { backgroundColor: surfaceColor, borderColor },
          ]}
          entering={FadeInDown.duration(500)}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.name,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {product.name}
            </Text>
            <Text
              style={[
                styles.price,
                {
                  color: COLORS.primary[isDark ? 400 : 500],
                  fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {formatPrice(product.price)}
            </Text>
          </View>
          
          {(product.size || product.careLevel) && (
            <View style={styles.attributesContainer}>
              {product.size && (
                <View
                  style={[
                    styles.attribute,
                    { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[100] },
                  ]}
                >
                  <Text
                    style={[
                      styles.attributeLabel,
                      {
                        color: secondaryTextColor,
                        fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                      },
                    ]}
                  >
                    {t('product.size')}
                  </Text>
                  <Text
                    style={[
                      styles.attributeValue,
                      {
                        color: textColor,
                        fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                      },
                    ]}
                  >
                    {product.size}
                  </Text>
                </View>
              )}
              
              {product.careLevel && (
                <View
                  style={[
                    styles.attribute,
                    { backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[100] },
                  ]}
                >
                  <Text
                    style={[
                      styles.attributeLabel,
                      {
                        color: secondaryTextColor,
                        fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                      },
                    ]}
                  >
                    {t('product.care')}
                  </Text>
                  <Text
                    style={[
                      styles.attributeValue,
                      {
                        color: textColor,
                        fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                      },
                    ]}
                  >
                    {product.careLevel}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('product.description')}
            </Text>
            <Text
              style={[
                styles.description,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {product.description}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
      
      <View
        style={[
          styles.footer,
          { backgroundColor: surfaceColor, borderTopColor: borderColor },
        ]}
      >
        {isInCart ? (
          <Button
            title={t('cart.viewCart')}
            onPress={handleGoToCart}
            icon={<ShoppingCart size={20} color={COLORS.white} />}
            size="large"
            style={styles.footerButton}
          />
        ) : (
          <Animated.View style={addButtonAnimatedStyle}>
            <Button
              title={t('product.addToCart')}
              onPress={handleAddToCart}
              icon={<ShoppingCart size={20} color={COLORS.white} />}
              isLoading={isAddingToCart}
              size="large"
              style={styles.footerButton}
            />
          </Animated.View>
        )}
        
        <Animated.View
          style={[styles.addedToCartContainer, addedToCartAnimatedStyle]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.addedToCartContent,
              {
                backgroundColor: COLORS.success.main,
              },
            ]}
          >
            <Check size={20} color={COLORS.white} />
            <Text
              style={[
                styles.addedToCartText,
                {
                  color: COLORS.white,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                },
              ]}
            >
              {t('product.added')}
            </Text>
          </View>
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
    paddingBottom: SPACING.xxxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.l,
    right: SPACING.l,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: SPACING.l,
    paddingTop: SPACING.xl,
    borderWidth: 1,
  },
  header: {
    marginBottom: SPACING.l,
  },
  name: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 22,
  },
  attributesContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
  },
  attribute: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    marginRight: SPACING.m,
  },
  attributeLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  attributeValue: {
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: SPACING.l,
  },
  descriptionTitle: {
    fontSize: 18,
    marginBottom: SPACING.s,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    padding: SPACING.l,
    borderTopWidth: 1,
  },
  footerButton: {
    borderRadius: BORDER_RADIUS.m,
  },
  addedToCartContainer: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  addedToCartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.l,
  },
  addedToCartText: {
    fontSize: 16,
    marginLeft: SPACING.s,
  },
});
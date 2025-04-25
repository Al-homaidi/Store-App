import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart, Plus, Check } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Product } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useCartStore } from '@/store/useCartStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
  horizontal?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  style,
  horizontal = false,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrencyStore();
  const { addItem, items } = useCartStore();
  
  const isInCart = items.some(item => item.product.id === product.id);
  const [isAdding, setIsAdding] = React.useState(false);
  
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    router.push(`/product/${product.id}`);
  };
  
  const handleAddToCart = () => {
    setIsAdding(true);
    buttonScale.value = withSpring(0.8, {}, () => {
      buttonScale.value = withSpring(1, {}, () => {
        addItem(product);
        setTimeout(() => {
          setIsAdding(false);
        }, 1500);
      });
    });
  };
  
  const backgroundColor = isDark ? COLORS.gray[800] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  
  return (
    <Animated.View
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
        { backgroundColor },
        animatedStyle,
        isDark ? SHADOWS.small : SHADOWS.medium,
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={horizontal ? styles.horizontalContent : styles.verticalContent}
      >
        <Image
          source={{ uri: product.image }}
          style={horizontal ? styles.horizontalImage : styles.verticalImage}
          resizeMode="cover"
        />
        
        <View style={horizontal ? styles.horizontalDetails : styles.verticalDetails}>
          <Text
            style={[
              styles.name,
              { 
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          
          <Text
            style={[
              styles.price,
              { 
                color: secondaryTextColor,
                fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}
          >
            {formatPrice(product.price)}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.addButtonContainer, buttonAnimatedStyle]}>
        <TouchableOpacity
          style={[
            styles.addButton,
            isInCart || isAdding ? styles.addedButton : null,
          ]}
          onPress={handleAddToCart}
          disabled={isInCart || isAdding}
        >
          {isInCart || isAdding ? (
            <Check size={18} color={COLORS.white} />
          ) : (
            <Plus size={18} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
    position: 'relative',
  },
  verticalContainer: {
    width: 160,
    height: 240,
  },
  horizontalContainer: {
    width: '100%',
    height: 120,
  },
  verticalContent: {
    flex: 1,
    flexDirection: 'column',
  },
  horizontalContent: {
    flex: 1,
    flexDirection: 'row',
  },
  verticalImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: BORDER_RADIUS.m,
    borderTopRightRadius: BORDER_RADIUS.m,
  },
  horizontalImage: {
    width: 120,
    height: '100%',
    borderTopLeftRadius: BORDER_RADIUS.m,
    borderBottomLeftRadius: BORDER_RADIUS.m,
  },
  verticalDetails: {
    padding: SPACING.m,
    flex: 1,
    justifyContent: 'space-between',
  },
  horizontalDetails: {
    padding: SPACING.m,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: COLORS.success.main,
  },
});

export default ProductCard;
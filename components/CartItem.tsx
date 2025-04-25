import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { CartItem as CartItemType } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useCartStore } from '@/store/useCartStore';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrencyStore();
  const { updateQuantity, removeItem } = useCartStore();
  const { t } = useTranslation();
  
  const { product, quantity } = item;
  
  const backgroundColor = isDark ? COLORS.gray[800] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      confirmRemove();
    }
  };
  
  const confirmRemove = () => {
    Alert.alert(
      t('cart.removeConfirm'),
      '',
      [
        {
          text: t('cart.no'),
          style: 'cancel',
        },
        {
          text: t('cart.yes'),
          style: 'destructive',
          onPress: () => removeItem(product.id),
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        isDark ? null : SHADOWS.small,
      ]}
      entering={FadeInRight}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.details}>
        <Text
          style={[
            styles.name,
            {
              color: textColor,
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              textAlign: isRTL ? 'right' : 'left',
            },
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
            },
          ]}
        >
          {formatPrice(product.price)}
        </Text>
        
        <View style={[styles.quantityContainer, { borderColor }]}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleDecrease}
          >
            <Minus size={16} color={secondaryTextColor} />
          </TouchableOpacity>
          
          <Text
            style={[
              styles.quantityText,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              },
            ]}
          >
            {quantity}
          </Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleIncrease}
          >
            <Plus size={16} color={COLORS.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={confirmRemove}
      >
        <Trash2 size={18} color={COLORS.error.main} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: BORDER_RADIUS.m,
    borderBottomLeftRadius: BORDER_RADIUS.m,
  },
  details: {
    flex: 1,
    padding: SPACING.m,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 16,
    marginBottom: SPACING.s,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.s,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: SPACING.xs,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    paddingHorizontal: SPACING.s,
  },
  removeButton: {
    padding: SPACING.m,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default CartItem;
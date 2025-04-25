import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useOrderStore } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { Order } from '@/types';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import { Package, ChevronRight, ChevronLeft } from 'lucide-react-native';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { orders } = useOrderStore();
  const { formatPrice } = useCurrencyStore();
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const surfaceColor = isDark ? COLORS.gray[800] : COLORS.white;
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };
  
  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => {
    const totalItems = item.items.reduce((acc, curr) => acc + curr.quantity, 0);
    const date = new Date(item.date).toLocaleDateString();
    
    // Determine status color
    let statusColor;
    switch (item.status) {
      case 'delivered':
        statusColor = COLORS.success.main;
        break;
      case 'shipped':
        statusColor = COLORS.primary[500];
        break;
      case 'processing':
        statusColor = COLORS.warning.main;
        break;
      default:
        statusColor = COLORS.info.main;
    }
    
    return (
      <Animated.View entering={FadeInDown.delay(100 * index).duration(500)}>
        <TouchableOpacity
          style={[
            styles.orderItem,
            {
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            },
            isDark ? null : SHADOWS.small,
          ]}
          onPress={() => navigateToOrderDetails(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.orderHeader}>
            <Text
              style={[
                styles.orderId,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                },
              ]}
            >
              {t('orders.orderNumber')} {item.id.slice(-8)}
            </Text>
            <Text
              style={[
                styles.orderDate,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                },
              ]}
            >
              {date}
            </Text>
          </View>
          
          <View style={styles.orderDetails}>
            <View style={styles.orderInfo}>
              <Text
                style={[
                  styles.orderLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  },
                ]}
              >
                {t('orders.status')}
              </Text>
              <Text
                style={[
                  styles.orderStatus,
                  {
                    color: statusColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  },
                ]}
              >
                {t(`orders.statuses.${item.status}`)}
              </Text>
            </View>
            
            <View style={styles.orderInfo}>
              <Text
                style={[
                  styles.orderLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  },
                ]}
              >
                {t('orders.items')}
              </Text>
              <Text
                style={[
                  styles.orderValue,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  },
                ]}
              >
                {totalItems}
              </Text>
            </View>
            
            <View style={styles.orderInfo}>
              <Text
                style={[
                  styles.orderLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  },
                ]}
              >
                {t('orders.total')}
              </Text>
              <Text
                style={[
                  styles.orderTotal,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  },
                ]}
              >
                {formatPrice(item.total)}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderAction}>
            {isRTL ? (
              <ChevronLeft size={20} color={COLORS.primary[isDark ? 400 : 500]} />
            ) : (
              <ChevronRight size={20} color={COLORS.primary[isDark ? 400 : 500]} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  if (orders.length === 0) {
    return (
      <SafeAreaContainer style={{ backgroundColor }}>
        <Header title={t('orders.title')} showBackButton={false} />
        
        <View style={styles.emptyContainer}>
          <Package size={64} color={COLORS.gray[300]} />
          <Text
            style={[
              styles.emptyText,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              },
            ]}
          >
            {t('orders.empty')}
          </Text>
        </View>
      </SafeAreaContainer>
    );
  }
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={t('orders.title')} showBackButton={false} />
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: SPACING.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
  orderItem: {
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    padding: SPACING.m,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  orderId: {
    fontSize: 16,
  },
  orderDate: {
    fontSize: 14,
  },
  orderDetails: {
    marginBottom: SPACING.m,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderLabel: {
    fontSize: 14,
  },
  orderValue: {
    fontSize: 14,
  },
  orderStatus: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
  },
  orderAction: {
    position: 'absolute',
    right: SPACING.m,
    bottom: SPACING.m,
  },
});
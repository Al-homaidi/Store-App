import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useOrderStore } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import Button from '@/components/Button';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { getOrderById } = useOrderStore();
  const { formatPrice } = useCurrencyStore();
  
  const order = getOrderById(id);
  
  if (!order) {
    return (
      <SafeAreaContainer>
        <Header title={t('orders.details')} />
        <View style={styles.centerContainer}>
          <Text>{t('orders.notFound')}</Text>
        </View>
      </SafeAreaContainer>
    );
  }
  
  const date = new Date(order.date).toLocaleDateString();
  
  // Determine status color
  let statusColor;
  switch (order.status) {
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
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const surfaceColor = isDark ? COLORS.gray[800] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={`${t('orders.details')} #${id.slice(-8)}`} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.orderSummary,
            { backgroundColor: surfaceColor, borderColor },
          ]}
          entering={FadeInDown.duration(500)}
        >
          <View style={styles.orderHeader}>
            <Text
              style={[
                styles.orderTitle,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('orders.summary')}
            </Text>
            <Text
              style={[
                styles.orderDate,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {date}
            </Text>
          </View>
          
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {t('orders.status')}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: statusColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {t(`orders.statuses.${order.status}`)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {t('orders.orderId')}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {id}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: secondaryTextColor,
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {t('orders.total')}
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <Text
          style={[
            styles.sectionTitle,
            {
              color: textColor,
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        >
          {t('orders.items')}
        </Text>
        
        {order.items.map((item, index) => (
          <Animated.View
            key={`${item.product.id}-${index}`}
            style={[
              styles.orderItem,
              { backgroundColor: surfaceColor, borderColor },
            ]}
            entering={FadeInDown.delay(300 + index * 100).duration(400)}
          >
            <Image
              source={{ uri: item.product.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            
            <View style={styles.itemDetails}>
              <Text
                style={[
                  styles.itemName,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                numberOfLines={2}
              >
                {item.product.name}
              </Text>
              
              <View style={styles.itemMeta}>
                <Text
                  style={[
                    styles.itemPrice,
                    {
                      color: secondaryTextColor,
                      fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {formatPrice(item.product.price)} x {item.quantity}
                </Text>
                
                <Text
                  style={[
                    styles.itemTotal,
                    {
                      color: textColor,
                      fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {formatPrice(item.product.price * item.quantity)}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
        
        <Animated.View
          style={[
            styles.totalSection,
            { backgroundColor: surfaceColor, borderColor },
          ]}
          entering={FadeInDown.delay(600).duration(400)}
        >
          <View style={styles.totalRow}>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('orders.subtotal')}
            </Text>
            <Text
              style={[
                styles.totalValue,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {formatPrice(order.total)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('orders.shipping')}
            </Text>
            <Text
              style={[
                styles.totalValue,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('orders.free')}
            </Text>
          </View>
          
          <View
            style={[
              styles.divider,
              { backgroundColor: borderColor },
            ]}
          />
          
          <View style={styles.totalRow}>
            <Text
              style={[
                styles.grandTotalLabel,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('orders.total')}
            </Text>
            <Text
              style={[
                styles.grandTotalValue,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {formatPrice(order.total)}
            </Text>
          </View>
        </Animated.View>
        
        <Button
          title={t('orders.trackOrder')}
          onPress={() => {}}
          style={styles.trackButton}
        />
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.l,
    paddingBottom: SPACING.xxxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderSummary: {
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  orderTitle: {
    fontSize: 18,
  },
  orderDate: {
    fontSize: 14,
  },
  orderInfo: {
    marginBottom: SPACING.s,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  orderItem: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    overflow: 'hidden',
    borderWidth: 1,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: SPACING.m,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    marginBottom: SPACING.s,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
  },
  itemTotal: {
    fontSize: 16,
  },
  totalSection: {
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.l,
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.m,
  },
  grandTotalLabel: {
    fontSize: 16,
  },
  grandTotalValue: {
    fontSize: 18,
  },
  trackButton: {
    marginBottom: SPACING.l,
  },
});
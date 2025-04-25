import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Chrome as Home, ShoppingCart, Package, User, Heart } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useCartStore } from '@/store/useCartStore';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { getTotalItems } = useCartStore();
  
  const cartItemCount = getTotalItems();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.gray[900] : COLORS.white,
          borderTopColor: isDark ? COLORS.gray[800] : COLORS.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary[isDark ? 400 : 500],
        tabBarInactiveTintColor: isDark ? COLORS.gray[400] : COLORS.gray[500],
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tabs.cart'),
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary[500],
          },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tabs.orders'),
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
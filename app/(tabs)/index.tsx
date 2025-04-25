import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { 
  FadeInDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useProductStore } from '@/store/useProductStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import ProductCard from '@/components/ProductCard';
import ProductCarousel from '@/components/ProductCarousel';
import Button from '@/components/Button';
import { Search, User, ChevronRight, ChevronLeft } from 'lucide-react-native';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { products, featured, getProductsByCategory } = useProductStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  
  const popular = getProductsByCategory('popular');
  const newArrivals = getProductsByCategory('new');
  const onSale = getProductsByCategory('sale');
  
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 80],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 80],
      [0, -50],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  const navigateToLogin = () => {
    router.push('/auth');
  };
  
  const navigateToProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };
  
  const renderFeaturedProductItem = (product: any, isActive: boolean) => (
    <TouchableOpacity
      style={[
        styles.featuredItemContainer,
        { backgroundColor: isDark ? COLORS.gray[800] : COLORS.white },
        isActive ? styles.featuredItemActive : null,
      ]}
      onPress={() => navigateToProduct(product.id)}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        <Animated.Image
          source={{ uri: product.image }}
          style={[
            styles.featuredImage,
            isActive ? { transform: [{ scale: 1.05 }] } : null,
          ]}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.featuredItemDetails}>
        <Text
          style={[
            styles.featuredItemName,
            {
              color: isDark ? COLORS.white : COLORS.gray[900],
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
            },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderProductItem = ({ item }: { item: any }) => (
    <ProductCard product={item} style={styles.productCard} />
  );
  
  const renderCategoryHeader = (title: string, onSeeAll: () => void) => (
    <View style={styles.categoryHeader}>
      <Text
        style={[
          styles.categoryTitle,
          {
            color: isDark ? COLORS.white : COLORS.gray[900],
            fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
          },
        ]}
      >
        {title}
      </Text>
      
      <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
        <Text
          style={[
            styles.seeAllText,
            {
              color: COLORS.primary[isDark ? 400 : 500],
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
            },
          ]}
        >
          {t('common.seeAll')}
        </Text>
        {isRTL ? (
          <ChevronLeft size={16} color={COLORS.primary[isDark ? 400 : 500]} />
        ) : (
          <ChevronRight size={16} color={COLORS.primary[isDark ? 400 : 500]} />
        )}
      </TouchableOpacity>
    </View>
  );
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <View>
            <Text
              style={[
                styles.greeting,
                {
                  color: isDark ? COLORS.gray[300] : COLORS.gray[600],
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {isAuthenticated
                ? `${t('common.greeting')}, ${user?.name}`
                : t('common.welcome')}
            </Text>
            <Text
              style={[
                styles.appName,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('app.name')}
            </Text>
          </View>
          
          {isAuthenticated ? (
            <TouchableOpacity
              style={[
                styles.profileButton,
                { backgroundColor: isDark ? COLORS.gray[800] : COLORS.white },
              ]}
              onPress={() => router.push('/profile')}
            >
              <User size={20} color={COLORS.primary[isDark ? 400 : 500]} />
            </TouchableOpacity>
          ) : (
            <Button
              title={t('auth.login')}
              onPress={navigateToLogin}
              variant="outline"
              size="small"
            />
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? COLORS.gray[800] : COLORS.white },
          ]}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />
          <Text
            style={[
              styles.searchPlaceholder,
              {
                color: isDark ? COLORS.gray[400] : COLORS.gray[500],
                fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
              },
            ]}
          >
            {t('common.search')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[500]}
            colors={[COLORS.primary[500]]}
          />
        }
      >
        <Animated.View entering={FadeInDown.delay(200).duration(700)}>
          <View style={styles.carouselContainer}>
            <ProductCarousel
              products={featured}
              renderItem={renderFeaturedProductItem}
              autoPlay
              loop
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(700)}>
          {renderCategoryHeader(t('home.popular'), () => {})}
          <FlatList
            data={popular}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600).duration(700)}>
          {renderCategoryHeader(t('home.new'), () => {})}
          <FlatList
            data={newArrivals}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(800).duration(700)}>
          {renderCategoryHeader(t('home.sale'), () => {})}
          <FlatList
            data={onSale}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  greeting: {
    fontSize: 14,
  },
  appName: {
    fontSize: 24,
    marginTop: SPACING.xs,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    height: 46,
    borderRadius: 23,
  },
  searchPlaceholder: {
    marginLeft: SPACING.s,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  carouselContainer: {
    height: 300,
    marginVertical: SPACING.m,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.s,
  },
  categoryTitle: {
    fontSize: 18,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  horizontalList: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  productCard: {
    marginRight: SPACING.m,
  },
  featuredItemContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredItemActive: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featuredImageContainer: {
    height: '80%',
    width: '100%',
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredItemDetails: {
    padding: SPACING.m,
    height: '20%',
    justifyContent: 'center',
  },
  featuredItemName: {
    fontSize: 16,
  },
});
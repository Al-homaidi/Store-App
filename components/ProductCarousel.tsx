import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import { Product } from '@/types';
import { SPACING } from '@/constants/theme';

interface ProductCarouselProps {
  products: Product[];
  renderItem: (item: Product, isActive: boolean) => React.ReactNode;
  autoPlay?: boolean;
  loop?: boolean;
}

interface ViewableItemsChangedInfo {
  viewableItems: ViewToken[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  renderItem,
  autoPlay = true,
  loop = true,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const ITEM_WIDTH = screenWidth * 0.75;
  const ITEM_HEIGHT = ITEM_WIDTH * 1.2;
  const SPACING_BETWEEN = SPACING.l;
  
  const flatListRef = useRef<FlatList>(null);
  const activeIndex = useSharedValue(0);
  const scrollX = useSharedValue(0);
  
  // For auto-scrolling
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    if (autoPlay && products.length > 1) {
      startAutoPlay();
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [products.length]);
  
  const startAutoPlay = () => {
    autoPlayRef.current = setInterval(() => {
      const nextIndex = (activeIndex.value + 1) % products.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);
  };
  
  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };
  
  const resumeAutoPlay = () => {
    if (autoPlay && !autoPlayRef.current) {
      startAutoPlay();
    }
  };
  
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: ViewableItemsChangedInfo) => {
      if (viewableItems.length > 0) {
        activeIndex.value = withTiming(viewableItems[0].index || 0, { duration: 150 });
      }
    }
  ).current;
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  
  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH + SPACING_BETWEEN,
    offset: (ITEM_WIDTH + SPACING_BETWEEN) * index,
    index,
  });
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING_BETWEEN}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={pauseAutoPlay}
        onScrollEndDrag={resumeAutoPlay}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        renderItem={({ item, index }) => {
          return (
            <CarouselItem
              item={item}
              index={index}
              activeIndex={activeIndex}
              scrollX={scrollX}
              itemWidth={ITEM_WIDTH}
              itemHeight={ITEM_HEIGHT}
              spacingBetween={SPACING_BETWEEN}
              renderContent={(isActive) => renderItem(item, isActive)}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      
      <View style={styles.paginationContainer}>
        {products.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </View>
    </View>
  );
};

interface CarouselItemProps {
  item: Product;
  index: number;
  activeIndex: Animated.SharedValue<number>;
  scrollX: Animated.SharedValue<number>;
  itemWidth: number;
  itemHeight: number;
  spacingBetween: number;
  renderContent: (isActive: boolean) => React.ReactNode;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  item,
  index,
  activeIndex,
  scrollX,
  itemWidth,
  itemHeight,
  spacingBetween,
  renderContent,
}) => {
  const inputRange = [
    (index - 1) * (itemWidth + spacingBetween),
    index * (itemWidth + spacingBetween),
    (index + 1) * (itemWidth + spacingBetween),
  ];
  
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8]
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6]
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });
  
  const isActive = useAnimatedStyle(() => {
    return {
      opacity: activeIndex.value === index ? 1 : 0,
    };
  });
  
  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          marginHorizontal: spacingBetween / 2,
        },
        animatedStyle,
      ]}
    >
      {renderContent(index === activeIndex.value)}
    </Animated.View>
  );
};

interface PaginationDotProps {
  index: number;
  activeIndex: Animated.SharedValue<number>;
}

const PaginationDot: React.FC<PaginationDotProps> = ({ index, activeIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    
    return {
      width: withTiming(isActive ? 20 : 8, { duration: 200 }),
      opacity: withTiming(isActive ? 1 : 0.5, { duration: 200 }),
      backgroundColor: withTiming(
        isActive ? 'rgba(53, 175, 113, 1)' : 'rgba(53, 175, 113, 0.5)',
        { duration: 200 }
      ),
    };
  });
  
  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.l,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ProductCarousel;
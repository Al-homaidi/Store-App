import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  height?: number | string;
  style?: ViewStyle;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ title, onClose, children, height = '50%', style }, ref) => {
    const { isDark } = useTheme();
    const { isRTL } = useLanguage();
    
    const modalAnim = useRef(new Animated.Value(0)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = React.useState(false);

    const backgroundColor = isDark ? COLORS.gray[800] : COLORS.white;
    const textColor = isDark ? COLORS.white : COLORS.gray[900];
    const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
    
    // Convert height to number if string percentage
    const sheetHeight = typeof height === 'string' && height.includes('%')
      ? SCREEN_HEIGHT * (parseInt(height) / 100)
      : typeof height === 'number'
      ? height
      : SCREEN_HEIGHT * 0.5;
    
    const open = () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
    
    const close = () => {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        if (onClose) onClose();
      });
    };
    
    useImperativeHandle(ref, () => ({
      open,
      close,
    }));
    
    const translateY = modalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [sheetHeight, 0],
    });
    
    if (!visible) return null;
    
    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropAnim },
            ]}
          />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor,
              height: sheetHeight,
              transform: [{ translateY }],
            },
            style,
          ]}
        >
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <View style={styles.handle} />
            
            {title && (
              <Text
                style={[
                  styles.title,
                  {
                    color: textColor,
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  },
                ]}
              >
                {title}
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={close}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={textColor} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
  },
  header: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray[300],
    marginBottom: SPACING.m,
  },
  title: {
    fontSize: 18,
    marginBottom: SPACING.s,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.l,
  },
});

export default BottomSheet;
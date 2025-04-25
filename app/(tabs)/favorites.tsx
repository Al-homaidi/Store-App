import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={t('favorites.title')} showBackButton={false} />
      
      <View style={styles.container}>
        <Heart size={64} color={COLORS.gray[300]} />
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
            },
          ]}
        >
          {t('favorites.empty')}
        </Text>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginTop: 16,
  },
});
import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Sharing from 'expo-sharing';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';
import { ThemeMode, LanguageCode, CurrencyCode } from '@/types';
import { LogOut, Moon, Sun, Globe, DollarSign, Bell, HelpCircle, Share2, ChevronRight, User as UserIcon } from 'lucide-react-native';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isDark, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { currentCurrency, setCurrency, currencies } = useCurrencyStore();
  
  const languageSheetRef = useRef<BottomSheetRef>(null);
  const currencySheetRef = useRef<BottomSheetRef>(null);
  const themeSheetRef = useRef<BottomSheetRef>(null);
  
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.gray[50];
  const surfaceColor = isDark ? COLORS.gray[800] : COLORS.white;
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const secondaryTextColor = isDark ? COLORS.gray[400] : COLORS.gray[600];
  const borderColor = isDark ? COLORS.gray[700] : COLORS.gray[200];
  
  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirm'),
      '',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleLanguageChange = async (code: LanguageCode) => {
    await setLanguage(code);
    languageSheetRef.current?.close();
  };
  
  const handleCurrencyChange = async (code: CurrencyCode) => {
    await setCurrency(code);
    currencySheetRef.current?.close();
  };
  
  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
    themeSheetRef.current?.close();
  };
  
  const handleShareApp = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        t('profile.shareNotAvailable'),
        t('profile.shareWebMessage')
      );
      return;
    }
    
    try {
      await Sharing.shareAsync('https://expo.dev');
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };
  
  const renderSetting = (
    icon: React.ReactNode,
    title: string,
    value: string | undefined,
    onPress: () => void,
    index: number
  ) => (
    <Animated.View entering={FadeInRight.delay(100 * index).duration(400)}>
      <TouchableOpacity
        style={[
          styles.settingItem,
          { backgroundColor: surfaceColor, borderColor },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingTitle,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {title}
          </Text>
          {value && (
            <Text
              style={[
                styles.settingValue,
                {
                  color: secondaryTextColor,
                  fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {value}
            </Text>
          )}
        </View>
        <ChevronRight size={20} color={secondaryTextColor} />
      </TouchableOpacity>
    </Animated.View>
  );
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={t('profile.title')} showBackButton={false} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.userCard,
            { backgroundColor: surfaceColor, borderColor },
          ]}
          entering={FadeInDown.duration(500)}
        >
          <View style={styles.userIconContainer}>
            <UserIcon size={40} color={COLORS.primary[isDark ? 400 : 500]} />
          </View>
          
          <View style={styles.userInfo}>
            {isAuthenticated ? (
              <>
                <Text
                  style={[
                    styles.userName,
                    {
                      color: textColor,
                      fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {user?.name}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    {
                      color: secondaryTextColor,
                      fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {user?.email}
                </Text>
              </>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/auth')}
              >
                <Text
                  style={[
                    styles.loginButtonText,
                    {
                      color: COLORS.primary[isDark ? 400 : 500],
                      fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    },
                  ]}
                >
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        
        <View style={styles.settingsSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: secondaryTextColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {t('profile.preferences')}
          </Text>
          
          {renderSetting(
            <Globe size={22} color={COLORS.primary[isDark ? 400 : 500]} />,
            t('profile.language'),
            t(`settings.language.${language}`),
            () => languageSheetRef.current?.open(),
            0
          )}
          
          {renderSetting(
            <DollarSign size={22} color={COLORS.primary[isDark ? 400 : 500]} />,
            t('profile.currency'),
            currentCurrency.name,
            () => currencySheetRef.current?.open(),
            1
          )}
          
          {renderSetting(
            isDark ? (
              <Moon size={22} color={COLORS.primary[400]} />
            ) : (
              <Sun size={22} color={COLORS.primary[500]} />
            ),
            t('profile.theme'),
            t(`settings.theme.${themeMode}`),
            () => themeSheetRef.current?.open(),
            2
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: secondaryTextColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {t('profile.general')}
          </Text>
          
          {renderSetting(
            <Bell size={22} color={COLORS.primary[isDark ? 400 : 500]} />,
            t('profile.notifications'),
            undefined,
            () => {},
            0
          )}
          
          {renderSetting(
            <HelpCircle size={22} color={COLORS.primary[isDark ? 400 : 500]} />,
            t('profile.help'),
            undefined,
            () => {},
            1
          )}
          
          {renderSetting(
            <Share2 size={22} color={COLORS.primary[isDark ? 400 : 500]} />,
            t('profile.shareApp'),
            undefined,
            handleShareApp,
            2
          )}
        </View>
        
        {isAuthenticated && (
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[100] },
            ]}
            onPress={handleLogout}
          >
            <LogOut size={20} color={COLORS.error.main} />
            <Text
              style={[
                styles.logoutText,
                {
                  color: COLORS.error.main,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                },
              ]}
            >
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* Language Bottom Sheet */}
      <BottomSheet
        ref={languageSheetRef}
        title={t('settings.language.title')}
      >
        <TouchableOpacity
          style={[
            styles.sheetItem,
            language === 'en' && styles.sheetItemSelected,
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text
            style={[
              styles.sheetItemText,
              {
                color: textColor,
                fontFamily: FONTS.medium,
              },
              language === 'en' && styles.sheetItemTextSelected,
            ]}
          >
            {t('settings.language.english')}
          </Text>
          {language === 'en' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sheetItem,
            language === 'ar' && styles.sheetItemSelected,
          ]}
          onPress={() => handleLanguageChange('ar')}
        >
          <Text
            style={[
              styles.sheetItemText,
              {
                color: textColor,
                fontFamily: FONTS.arMedium,
              },
              language === 'ar' && styles.sheetItemTextSelected,
            ]}
          >
            {t('settings.language.arabic')}
          </Text>
          {language === 'ar' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sheetItem,
            language === 'tr' && styles.sheetItemSelected,
          ]}
          onPress={() => handleLanguageChange('tr')}
        >
          <Text
            style={[
              styles.sheetItemText,
              {
                color: textColor,
                fontFamily: FONTS.medium,
              },
              language === 'tr' && styles.sheetItemTextSelected,
            ]}
          >
            {t('settings.language.turkish')}
          </Text>
          {language === 'tr' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
      </BottomSheet>
      
      {/* Currency Bottom Sheet */}
      <BottomSheet
        ref={currencySheetRef}
        title={t('settings.currency.title')}
      >
        {Object.entries(currencies).map(([code, currency]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.sheetItem,
              currentCurrency.code === code && styles.sheetItemSelected,
            ]}
            onPress={() => handleCurrencyChange(code as CurrencyCode)}
          >
            <Text
              style={[
                styles.sheetItemText,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                },
                currentCurrency.code === code && styles.sheetItemTextSelected,
              ]}
            >
              {t(`settings.currency.${code.toLowerCase()}`)}
            </Text>
            {currentCurrency.code === code && (
              <View
                style={[
                  styles.selectedIndicator,
                  { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </BottomSheet>
      
      {/* Theme Bottom Sheet */}
      <BottomSheet
        ref={themeSheetRef}
        title={t('settings.theme.title')}
      >
        <TouchableOpacity
          style={[
            styles.sheetItem,
            themeMode === 'light' && styles.sheetItemSelected,
          ]}
          onPress={() => handleThemeChange('light')}
        >
          <View style={styles.themeOption}>
            <Sun size={20} color={textColor} />
            <Text
              style={[
                styles.sheetItemText,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  marginLeft: SPACING.s,
                },
                themeMode === 'light' && styles.sheetItemTextSelected,
              ]}
            >
              {t('settings.theme.light')}
            </Text>
          </View>
          {themeMode === 'light' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sheetItem,
            themeMode === 'dark' && styles.sheetItemSelected,
          ]}
          onPress={() => handleThemeChange('dark')}
        >
          <View style={styles.themeOption}>
            <Moon size={20} color={textColor} />
            <Text
              style={[
                styles.sheetItemText,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                  marginLeft: SPACING.s,
                },
                themeMode === 'dark' && styles.sheetItemTextSelected,
              ]}
            >
              {t('settings.theme.dark')}
            </Text>
          </View>
          {themeMode === 'dark' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sheetItem,
            themeMode === 'system' && styles.sheetItemSelected,
          ]}
          onPress={() => handleThemeChange('system')}
        >
          <Text
            style={[
              styles.sheetItemText,
              {
                color: textColor,
                fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
              },
              themeMode === 'system' && styles.sheetItemTextSelected,
            ]}
          >
            {t('settings.theme.system')}
          </Text>
          {themeMode === 'system' && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: COLORS.primary[isDark ? 400 : 500] },
              ]}
            />
          )}
        </TouchableOpacity>
      </BottomSheet>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.l,
    borderWidth: 1,
  },
  userIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(53, 175, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: 14,
  },
  loginButton: {
    paddingVertical: SPACING.s,
  },
  loginButtonText: {
    fontSize: 16,
  },
  settingsSection: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: SPACING.s,
    marginLeft: SPACING.s,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
  },
  settingIcon: {
    marginRight: SPACING.m,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    marginTop: SPACING.l,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: SPACING.s,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  sheetItemSelected: {
    backgroundColor: 'rgba(53, 175, 113, 0.05)',
  },
  sheetItemText: {
    fontSize: 16,
  },
  sheetItemTextSelected: {
    color: COLORS.primary[500],
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
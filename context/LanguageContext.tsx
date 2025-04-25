import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { I18nManager, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

type LanguageCode = 'en' | 'ar' | 'tr';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await SecureStore.getItemAsync('language');

        if (!savedLanguage) {
          let deviceLanguage: string | null = null;

          if (Platform.OS === 'ios') {
            const settingsManager =
              require('react-native').NativeModules.SettingsManager;
            deviceLanguage =
              settingsManager?.settings?.AppleLocale ||
              settingsManager?.settings?.AppleLanguages?.[0];
          } else {
            deviceLanguage =
              require('react-native').NativeModules.I18nManager
                ?.localeIdentifier;
          }

          const languageCode = deviceLanguage?.split(/[_-]/)[0] || 'en';

          const supportedLanguage = ['en', 'ar', 'tr'].includes(languageCode)
            ? (languageCode as LanguageCode)
            : 'en';

          changeLanguage(supportedLanguage);
        } else {
          changeLanguage(savedLanguage as LanguageCode);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
        changeLanguage('en');
      }
    };

    loadLanguagePreference();
  }, []);

  const changeLanguage = async (code: LanguageCode) => {
    setLanguageState(code);
    await i18n.changeLanguage(code);

    const shouldBeRTL = code === 'ar';
    setIsRTL(shouldBeRTL);

    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
  };

  const setLanguage = async (code: LanguageCode) => {
    try {
      await SecureStore.setItemAsync('language', code);
      changeLanguage(code);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

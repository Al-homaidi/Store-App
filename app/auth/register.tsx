import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { AtSign, Lock, User } from 'lucide-react-native';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);
  
  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withSpring(0);
  }, []);
  
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError(t('auth.errorEmpty'));
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    const success = await register(name, email, password);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError('Registration failed. Email might be already in use.');
      setIsLoading(false);
    }
  };
  
  const goToLogin = () => {
    router.back();
  };
  
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <Header title={t('auth.register')} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            {error ? (
              <Text
                style={[
                  styles.error,
                  {
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {error}
              </Text>
            ) : null}
            
            <Input
              label={t('auth.name')}
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              leftIcon={<User size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />}
            />
            
            <Input
              label={t('auth.email')}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<AtSign size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />}
            />
            
            <Input
              label={t('auth.password')}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              isPasswordInput
              leftIcon={<Lock size={20} color={isDark ? COLORS.gray[400] : COLORS.gray[500]} />}
            />
            
            <Animated.View style={buttonAnimatedStyle}>
              <Button
                title={t('auth.register')}
                onPress={handleRegister}
                isLoading={isLoading}
                style={styles.registerButton}
                size="large"
              />
            </Animated.View>
            
            <View style={styles.loginContainer}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: isDark ? COLORS.gray[400] : COLORS.gray[600],
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  },
                ]}
              >
                {t('auth.hasAccount')}
              </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text
                  style={[
                    styles.loginLink,
                    {
                      color: COLORS.primary[isDark ? 400 : 500],
                      fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    },
                  ]}
                >
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  error: {
    color: COLORS.error.main,
    marginBottom: SPACING.m,
  },
  registerButton: {
    marginTop: SPACING.m,
    marginBottom: SPACING.l,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  loginText: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
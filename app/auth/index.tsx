import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { AtSign, Lock } from 'lucide-react-native';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const { isRTL } = useLanguage();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const logoPosition = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  
  React.useEffect(() => {
    logoPosition.value = withSequence(
      withTiming(-20, { duration: 500 }),
      withSpring(0)
    );
    
    formOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 800 })
    );
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: logoPosition.value }],
    };
  });
  
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.errorEmpty'));
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    const success = await login(email, password);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      setError(t('auth.errorInvalid'));
      setIsLoading(false);
    }
  };
  
  const goToRegister = () => {
    router.push('/auth/register');
  };
  
  const textColor = isDark ? COLORS.white : COLORS.gray[900];
  const backgroundColor = isDark ? COLORS.gray[900] : COLORS.white;
  
  return (
    <SafeAreaContainer style={{ backgroundColor }}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.logo}
              resizeMode="cover"
            />
          </Animated.View>
          
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <Text
              style={[
                styles.title,
                {
                  color: textColor,
                  fontFamily: isRTL ? FONTS.arSemiBold : FONTS.semiBold,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {t('auth.login')}
            </Text>
            
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
            
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text
                style={[
                  styles.forgotPassword,
                  {
                    color: COLORS.primary[isDark ? 400 : 500],
                    fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>
            
            <Animated.View style={buttonAnimatedStyle}>
              <Button
                title={t('auth.login')}
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.loginButton}
                size="large"
              />
            </Animated.View>
            
            <View style={styles.registerContainer}>
              <Text
                style={[
                  styles.registerText,
                  {
                    color: isDark ? COLORS.gray[400] : COLORS.gray[600],
                    fontFamily: isRTL ? FONTS.arRegular : FONTS.regular,
                  },
                ]}
              >
                {t('auth.noAccount')}
              </Text>
              <TouchableOpacity onPress={goToRegister}>
                <Text
                  style={[
                    styles.registerLink,
                    {
                      color: COLORS.primary[isDark ? 400 : 500],
                      fontFamily: isRTL ? FONTS.arMedium : FONTS.medium,
                    },
                  ]}
                >
                  {t('auth.register')}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: SPACING.l,
  },
  error: {
    color: COLORS.error.main,
    marginBottom: SPACING.m,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.l,
  },
  forgotPassword: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: SPACING.l,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  registerText: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;

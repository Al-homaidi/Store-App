import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { storage } from '@/utils/storage';

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingComplete = await storage.getItem('onboardingComplete');
        
        if (onboardingComplete === 'true') {
          // Onboarding completed, go to main app
          router.replace('/(tabs)');
        } else {
          // Onboarding not completed
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        router.replace('/onboarding');
      }
    };
    
    if (!isLoading) {
      checkOnboarding();
    }
  }, [isLoading]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary[500]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
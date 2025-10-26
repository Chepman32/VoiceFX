/**
 * VoiceFX App - Main Application Component
 * Production-ready offline voice effects editor
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider, useTheme} from '@/theme';
import {RootNavigator} from '@/navigation/RootNavigator';
import {db} from '@/database/client';
import {SplashScreen} from '@/screens/SplashScreen';
import {ErrorBoundary} from '@/components/ErrorBoundary';

// Ignore specific warnings for production
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AppContent: React.FC = () => {
  const {theme} = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await db.initialize();

      // Add small delay for splash animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsReady(true);

      // Hide splash after animation completes
      setTimeout(() => {
        setShowSplash(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setIsReady(true);
      setShowSplash(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer
        theme={{
          dark: theme.isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.error,
          },
        }}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;

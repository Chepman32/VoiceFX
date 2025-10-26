/**
 * Root Navigator - Main navigation stack
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {TabNavigator} from './TabNavigator';
import {OnboardingScreen} from '@/screens/OnboardingScreen';
import {EditorScreen} from '@/screens/EditorScreen';
import {SettingsScreen} from '@/screens/SettingsScreen';
import {ExportScreen} from '@/screens/ExportScreen';
import {ProScreen} from '@/screens/ProScreen';
import {useStore} from '@/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const onboardingCompleted = useStore(
    state => state.preferences.onboardingCompleted
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
      initialRouteName={onboardingCompleted ? 'MainTabs' : 'Onboarding'}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: true, title: 'Settings'}}
      />
      <Stack.Screen
        name="Export"
        component={ExportScreen}
        options={{
          headerShown: true,
          title: 'Export',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Pro"
        component={ProScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Tab Navigator - Bottom tabs with animated indicators
 */

import React from 'react';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabParamList} from './types';
import {HomeScreen} from '@/screens/HomeScreen';
import {LibraryScreen} from '@/screens/LibraryScreen';
import {EffectsScreen} from '@/screens/EffectsScreen';
import {MoreScreen} from '@/screens/MoreScreen';
import {useTheme} from '@/theme';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: 17,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => null, // Icons would be added with actual icon library
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'Library',
          tabBarLabel: 'Library',
          tabBarIcon: ({color, size}) => null,
        }}
      />
      <Tab.Screen
        name="Effects"
        component={EffectsScreen}
        options={{
          title: 'Effects',
          tabBarLabel: 'Effects',
          tabBarIcon: ({color, size}) => null,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({color, size}) => null,
        }}
      />
    </Tab.Navigator>
  );
};

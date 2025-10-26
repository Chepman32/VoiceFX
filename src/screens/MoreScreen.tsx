/**
 * More Screen - Settings and additional options
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import {PressableScale} from '@/components/animated/PressableScale';
import {useStore} from '@/store';

export const MoreScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {toggleHaptics, toggleSoundEffects, preferences} = useStore();

  const menuItems = [
    {
      title: 'Settings',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      title: 'Upgrade to Pro',
      onPress: () => navigation.navigate('Pro' as never),
    },
    {
      title: 'Haptic Feedback',
      onPress: toggleHaptics,
      subtitle: preferences.hapticsEnabled ? 'On' : 'Off',
    },
    {
      title: 'Sound Effects',
      onPress: toggleSoundEffects,
      subtitle: preferences.soundEffectsEnabled ? 'On' : 'Off',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <PressableScale
            key={index}
            style={[styles.menuItem, {backgroundColor: theme.colors.surface}]}
            onPress={item.onPress}>
            <Text style={[styles.menuTitle, {color: theme.colors.text}]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.menuSubtitle, {color: theme.colors.textSecondary}]}>
                {item.subtitle}
              </Text>
            )}
          </PressableScale>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  menuItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 15,
  },
});

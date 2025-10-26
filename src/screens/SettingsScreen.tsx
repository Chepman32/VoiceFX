/**
 * Settings Screen - App configuration
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/theme';
import {useStore} from '@/store';
import {PressableScale} from '@/components/animated/PressableScale';

export const SettingsScreen: React.FC = () => {
  const {theme, setThemeMode, themeMode} = useTheme();
  const {
    preferences,
    toggleHaptics,
    toggleSoundEffects,
    toggleAnalytics,
  } = useStore();

  const themeOptions: Array<{value: 'light' | 'dark' | 'system'; label: string}> = [
    {value: 'light', label: 'Light'},
    {value: 'dark', label: 'Dark'},
    {value: 'system', label: 'System'},
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Appearance
          </Text>
          <View style={styles.themeOptions}>
            {themeOptions.map(option => (
              <PressableScale
                key={option.value}
                style={[
                  styles.themeButton,
                  themeMode === option.value && {
                    backgroundColor: theme.colors.primary,
                  },
                  themeMode !== option.value && {
                    backgroundColor: theme.colors.backgroundSecondary,
                  },
                ]}
                onPress={() => setThemeMode(option.value)}>
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color:
                        themeMode === option.value
                          ? '#FFFFFF'
                          : theme.colors.text,
                    },
                  ]}>
                  {option.label}
                </Text>
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Preferences
          </Text>

          <View style={[styles.settingRow, {backgroundColor: theme.colors.surface}]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, {color: theme.colors.text}]}>
                Haptic Feedback
              </Text>
              <Text style={[styles.settingDescription, {color: theme.colors.textSecondary}]}>
                Feel vibrations when interacting
              </Text>
            </View>
            <Switch
              value={preferences.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={[styles.settingRow, {backgroundColor: theme.colors.surface}]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, {color: theme.colors.text}]}>
                Sound Effects
              </Text>
              <Text style={[styles.settingDescription, {color: theme.colors.textSecondary}]}>
                Play sounds for actions
              </Text>
            </View>
            <Switch
              value={preferences.soundEffectsEnabled}
              onValueChange={toggleSoundEffects}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>

          <View style={[styles.settingRow, {backgroundColor: theme.colors.surface}]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, {color: theme.colors.text}]}>
                Analytics
              </Text>
              <Text style={[styles.settingDescription, {color: theme.colors.textSecondary}]}>
                Help improve the app
              </Text>
            </View>
            <Switch
              value={preferences.analyticsEnabled}
              onValueChange={toggleAnalytics}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            About
          </Text>
          <View style={[styles.aboutCard, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.aboutText, {color: theme.colors.textSecondary}]}>
              VoiceFX v1.0.0
            </Text>
            <Text style={[styles.aboutText, {color: theme.colors.textSecondary}]}>
              Offline Voice Effects & Editor
            </Text>
          </View>
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  aboutCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

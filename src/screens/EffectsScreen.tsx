/**
 * Effects Screen - Browse and preview voice effects
 */

import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeInRight} from 'react-native-reanimated';
import {useTheme} from '@/theme';
import {useEffects, useIsPro} from '@/store';
import {PressableScale} from '@/components/animated/PressableScale';
import {VoiceEffect} from '@/types/common';

export const EffectsScreen: React.FC = () => {
  const {theme} = useTheme();
  const effects = useEffects();
  const isPro = useIsPro();

  const renderEffect = ({item, index}: {item: VoiceEffect; index: number}) => (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <PressableScale
        style={[styles.effectCard, {backgroundColor: theme.colors.surface}]}
        disabled={item.isPro && !isPro}>
        <View style={styles.effectInfo}>
          <View style={styles.effectHeader}>
            <Text style={[styles.effectName, {color: theme.colors.text}]}>
              {item.name}
            </Text>
            {item.isPro && !isPro && (
              <View
                style={[
                  styles.proBadge,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={[styles.effectType, {color: theme.colors.textSecondary}]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <FlatList
        data={effects}
        renderItem={renderEffect}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  effectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  effectInfo: {
    flex: 1,
  },
  effectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  effectName: {
    fontSize: 17,
    fontWeight: '600',
  },
  effectType: {
    fontSize: 14,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

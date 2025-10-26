/**
 * Editor Screen - Audio editing and effect application
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useTheme} from '@/theme';
import {PressableScale} from '@/components/animated/PressableScale';
import {useStore, useEffects} from '@/store';
import {RootStackParamList} from '@/navigation/types';
import {AudioProject, VoiceEffect} from '@/types/common';

type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

export const EditorScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute<EditorScreenRouteProp>();
  const {projectId} = route.params || {};

  const {projects, updateProject, addProject} = useStore();
  const effects = useEffects();
  const [selectedEffects, setSelectedEffects] = useState<VoiceEffect[]>([]);

  const project = projectId
    ? projects.find(p => p.id === projectId)
    : null;

  const handleApplyEffect = (effect: VoiceEffect) => {
    setSelectedEffects(prev => [...prev, effect]);
    Alert.alert('Effect Applied', `${effect.name} has been applied`);
  };

  const handleSave = () => {
    if (projectId && project) {
      updateProject(projectId, {
        effects: selectedEffects,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newProject: AudioProject = {
        id: Date.now().toString(),
        title: 'New Project',
        duration: 0,
        fileUri: '',
        effects: selectedEffects,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        tags: [],
      };
      addProject(newProject);
    }

    navigation.goBack();
  };

  const handleExport = () => {
    if (projectId) {
      navigation.navigate('Export' as never, {projectId} as never);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {project?.title || 'New Project'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Waveform Placeholder */}
        <View
          style={[
            styles.waveform,
            {backgroundColor: theme.colors.backgroundSecondary},
          ]}>
          <Text style={[styles.placeholderText, {color: theme.colors.textTertiary}]}>
            Waveform Visualization
          </Text>
        </View>

        {/* Applied Effects */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Applied Effects ({selectedEffects.length})
          </Text>
          {selectedEffects.map((effect, index) => (
            <View
              key={index}
              style={[styles.effectChip, {backgroundColor: theme.colors.surface}]}>
              <Text style={[styles.effectChipText, {color: theme.colors.text}]}>
                {effect.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Available Effects */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Available Effects
          </Text>
          {effects.slice(0, 5).map(effect => (
            <PressableScale
              key={effect.id}
              style={[styles.effectButton, {backgroundColor: theme.colors.surface}]}
              onPress={() => handleApplyEffect(effect)}>
              <Text style={[styles.effectButtonText, {color: theme.colors.text}]}>
                {effect.name}
              </Text>
            </PressableScale>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomBar,
          {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border},
        ]}>
        <PressableScale
          style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleSave}>
          <Text style={styles.actionButtonText}>Save</Text>
        </PressableScale>
        {projectId && (
          <PressableScale
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.backgroundSecondary},
            ]}
            onPress={handleExport}>
            <Text style={[styles.actionButtonText, {color: theme.colors.text}]}>
              Export
            </Text>
          </PressableScale>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  waveform: {
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  effectChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  effectChipText: {
    fontSize: 15,
  },
  effectButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  effectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

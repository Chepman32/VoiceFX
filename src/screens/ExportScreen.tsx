/**
 * Export Screen - Export projects in various formats
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {useTheme} from '@/theme';
import {PressableScale} from '@/components/animated/PressableScale';
import {useProjects} from '@/store';
import {RootStackParamList} from '@/navigation/types';
import {ExportFormat} from '@/types/common';

type ExportScreenRouteProp = RouteProp<RootStackParamList, 'Export'>;

export const ExportScreen: React.FC = () => {
  const {theme} = useTheme();
  const route = useRoute<ExportScreenRouteProp>();
  const navigation = useNavigation();
  const projects = useProjects();
  const {projectId} = route.params;

  const project = projects.find(p => p.id === projectId);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat['format']>('audio');
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const formats: Array<{
    format: ExportFormat['format'];
    title: string;
    description: string;
  }> = [
    {format: 'audio', title: 'Audio File', description: 'Export as WAV or MP3'},
    {format: 'json', title: 'JSON', description: 'Export project data as JSON'},
    {format: 'markdown', title: 'Markdown', description: 'Export as Markdown report'},
    {format: 'pdf', title: 'PDF', description: 'Export as PDF document'},
  ];

  const handleExport = async () => {
    if (!project) {
      Alert.alert('Error', 'Project not found');
      return;
    }

    const exportData: ExportFormat = {
      format: selectedFormat,
      includeMetadata,
    };

    // Export logic would go here
    Alert.alert(
      'Export Successful',
      `${project.title} has been exported as ${selectedFormat.toUpperCase()}`,
      [
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!project) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.errorText, {color: theme.colors.error}]}>
          Project not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.projectTitle, {color: theme.colors.text}]}>
          {project.title}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Export Format
          </Text>
          {formats.map(format => (
            <PressableScale
              key={format.format}
              style={[
                styles.formatCard,
                selectedFormat === format.format && {
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
                selectedFormat !== format.format && {
                  backgroundColor: theme.colors.surface,
                },
              ]}
              onPress={() => setSelectedFormat(format.format)}>
              <Text style={[styles.formatTitle, {color: theme.colors.text}]}>
                {format.title}
              </Text>
              <Text style={[styles.formatDescription, {color: theme.colors.textSecondary}]}>
                {format.description}
              </Text>
            </PressableScale>
          ))}
        </View>

        <View style={styles.section}>
          <PressableScale
            style={[
              styles.optionRow,
              {backgroundColor: theme.colors.surface},
            ]}
            onPress={() => setIncludeMetadata(!includeMetadata)}>
            <Text style={[styles.optionText, {color: theme.colors.text}]}>
              Include Metadata
            </Text>
            <View
              style={[
                styles.checkbox,
                includeMetadata && {backgroundColor: theme.colors.primary},
                !includeMetadata && {borderColor: theme.colors.border, borderWidth: 2},
              ]}
            />
          </PressableScale>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PressableScale
          style={[styles.exportButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleExport}>
          <Text style={styles.exportButtonText}>Export</Text>
        </PressableScale>
      </View>
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
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formatCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  formatTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  bottomBar: {
    padding: 16,
  },
  exportButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 32,
  },
});

/**
 * Home Screen - Main dashboard with recent projects and quick actions
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useTheme} from '@/theme';
import {useStore, useProjects, useIsPro} from '@/store';
import {PressableScale} from '@/components/animated/PressableScale';
import {RootStackParamList} from '@/navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const {width} = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const projects = useProjects();
  const isPro = useIsPro();

  const recentProjects = projects.slice(0, 5);

  const handleNewProject = () => {
    navigation.navigate('Editor', {});
  };

  const handleProjectPress = (projectId: string) => {
    navigation.navigate('Editor', {projectId});
  };

  const handleUpgradeToPro = () => {
    navigation.navigate('Pro');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.hero}>
          <Text style={[styles.heroTitle, {color: theme.colors.text}]}>
            Welcome to VoiceFX
          </Text>
          <Text style={[styles.heroSubtitle, {color: theme.colors.textSecondary}]}>
            Create amazing voice effects offline
          </Text>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <PressableScale
            style={[
              styles.primaryButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={handleNewProject}>
            <Text style={styles.primaryButtonText}>New Project</Text>
          </PressableScale>
        </Animated.View>

        {/* Pro Upsell */}
        {!isPro && (
          <Animated.View entering={FadeInDown.delay(300)}>
            <PressableScale
              style={[
                styles.proCard,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={handleUpgradeToPro}>
              <Text style={[styles.proTitle, {color: theme.colors.primary}]}>
                Upgrade to Pro
              </Text>
              <Text style={[styles.proDescription, {color: theme.colors.textSecondary}]}>
                Unlock all effects, remove limits, and support development
              </Text>
            </PressableScale>
          </Animated.View>
        )}

        {/* Recent Projects */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Recent Projects
          </Text>

          {recentProjects.length === 0 ? (
            <View style={[styles.emptyState, {backgroundColor: theme.colors.backgroundSecondary}]}>
              <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                No projects yet. Create your first project to get started!
              </Text>
            </View>
          ) : (
            recentProjects.map((project, index) => (
              <Animated.View
                key={project.id}
                entering={FadeInDown.delay(500 + index * 50)}>
                <PressableScale
                  style={[
                    styles.projectCard,
                    {backgroundColor: theme.colors.surface},
                  ]}
                  onPress={() => handleProjectPress(project.id)}>
                  <View style={styles.projectInfo}>
                    <Text style={[styles.projectTitle, {color: theme.colors.text}]}>
                      {project.title}
                    </Text>
                    <Text style={[styles.projectMeta, {color: theme.colors.textTertiary}]}>
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </PressableScale>
              </Animated.View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  hero: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  proCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  proTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  proDescription: {
    fontSize: 15,
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectMeta: {
    fontSize: 13,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});

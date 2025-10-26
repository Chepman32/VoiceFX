/**
 * Library Screen - Browse and manage all projects
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useTheme} from '@/theme';
import {useProjects} from '@/store';
import {PressableScale} from '@/components/animated/PressableScale';
import {AudioProject} from '@/types/common';

export const LibraryScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const projects = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' || (filter === 'favorites' && project.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const renderProject = ({item}: {item: AudioProject}) => (
    <Animated.View entering={FadeIn}>
      <PressableScale
        style={[styles.projectCard, {backgroundColor: theme.colors.surface}]}
        onPress={() => navigation.navigate('Editor' as never, {projectId: item.id} as never)}>
        <View style={styles.projectInfo}>
          <Text style={[styles.projectTitle, {color: theme.colors.text}]}>
            {item.title}
          </Text>
          <Text style={[styles.projectMeta, {color: theme.colors.textSecondary}]}>
            {`${Math.floor(item.duration / 60)}:${(item.duration % 60)
              .toString()
              .padStart(2, '0')} • ${new Date(
              item.updatedAt
            ).toLocaleDateString()}`}
          </Text>
          {item.tags.length > 0 && (
            <View style={styles.tagContainer}>
              {item.tags.slice(0, 3).map(tag => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    {backgroundColor: theme.colors.backgroundTertiary},
                  ]}>
                  <Text style={[styles.tagText, {color: theme.colors.textSecondary}]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
            },
          ]}
          placeholder="Search projects..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && {backgroundColor: theme.colors.primary},
            filter !== 'all' && {backgroundColor: theme.colors.backgroundSecondary},
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              {color: filter === 'all' ? '#FFFFFF' : theme.colors.text},
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'favorites' && {backgroundColor: theme.colors.primary},
            filter !== 'favorites' && {backgroundColor: theme.colors.backgroundSecondary},
          ]}
          onPress={() => setFilter('favorites')}>
          <Text
            style={[
              styles.filterText,
              {color: filter === 'favorites' ? '#FFFFFF' : theme.colors.text},
            ]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
              {searchQuery
                ? 'No projects match your search'
                : filter === 'favorites'
                ? 'No favorite projects yet'
                : 'No projects yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  projectMeta: {
    fontSize: 13,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});

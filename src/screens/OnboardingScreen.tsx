/**
 * Onboarding Screen - First-time user experience
 */

import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {useTheme} from '@/theme';
import {PressableScale} from '@/components/animated/PressableScale';
import {useStore} from '@/store';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Voice Effects',
    description: 'Apply amazing voice effects to your recordings',
  },
  {
    id: '2',
    title: 'Offline First',
    description: 'Works completely offline. Your data stays on your device.',
  },
  {
    id: '3',
    title: 'Easy to Use',
    description: 'Intuitive interface with gesture-based controls',
  },
];

export const OnboardingScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {completeOnboarding} = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs' as never}],
    });
  };

  const handleGetStarted = () => {
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs' as never}],
    });
  };

  const renderSlide = ({item, index}: {item: typeof slides[0]; index: number}) => (
    <View style={[styles.slide, {width}]}>
      <View
        style={[
          styles.slideContent,
          {backgroundColor: theme.colors.backgroundSecondary},
        ]}
      />
      <Text style={[styles.title, {color: theme.colors.text}]}>
        {item.title}
      </Text>
      <Text style={[styles.description, {color: theme.colors.textSecondary}]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <View style={styles.skipContainer}>
        <PressableScale onPress={handleSkip}>
          <Text style={[styles.skipText, {color: theme.colors.primary}]}>
            Skip
          </Text>
        </PressableScale>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={item => item.id}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentIndex === index
                    ? theme.colors.primary
                    : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex === slides.length - 1 ? (
          <PressableScale
            style={[
              styles.button,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </PressableScale>
        ) : (
          <PressableScale
            style={[
              styles.button,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
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
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  slideContent: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

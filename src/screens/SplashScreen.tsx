/**
 * Splash Screen - Physics-based animated logo breakdown
 * Uses Skia for particle effects and logo reassembly
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {Canvas, Circle, Group, Text as SkiaText, useFont} from '@shopify/react-native-skia';
import {useColors} from '@/theme';

const {width, height} = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  radius: number;
}

export const SplashScreen: React.FC = () => {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const particlesProgress = useSharedValue(0);

  useEffect(() => {
    // Fade in
    opacity.value = withTiming(1, {duration: 300});

    // Scale animation
    scale.value = withSequence(
      withSpring(1.2, {stiffness: 180, damping: 12}),
      withSpring(1, {stiffness: 240, damping: 18})
    );

    // Particle assembly animation
    setTimeout(() => {
      particlesProgress.value = withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      });
    }, 300);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  // Generate particles for logo effect
  const particles: Particle[] = React.useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const count = 50;
    const result: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 100;
      const distance = Math.random() * 200 + 100;

      result.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        targetX: centerX + Math.cos(angle) * radius,
        targetY: centerY + Math.sin(angle) * radius,
        color: i % 2 === 0 ? colors.primary : colors.primaryLight,
        radius: Math.random() * 4 + 2,
      });
    }

    return result;
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animated.View style={containerStyle}>
        <Canvas style={styles.canvas}>
          <Group>
            {particles.map((particle, index) => {
              const progress = particlesProgress.value;
              const currentX =
                particle.x + (particle.targetX - particle.x) * progress;
              const currentY =
                particle.y + (particle.targetY - particle.y) * progress;

              return (
                <Circle
                  key={index}
                  cx={currentX}
                  cy={currentY}
                  r={particle.radius}
                  color={particle.color}
                  opacity={progress}
                />
              );
            })}
          </Group>
        </Canvas>

        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.title,
              {color: colors.text},
              containerStyle,
            ]}>
            VoiceFX
          </Animated.Text>
          <Animated.Text
            style={[
              styles.subtitle,
              {color: colors.textSecondary},
              containerStyle,
            ]}>
            Voice Effects & Editor
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: width,
    height: height,
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

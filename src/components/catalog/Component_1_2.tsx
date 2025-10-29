/**
 * Component 1.2 - Scrollable Card Component
 * Props: number, imageUri, enum, enum, angle, angle, angle, boolean
 * Gestures: scroll, pan, tap, longPress
 */

import React from 'react';
import {ScrollView, StyleSheet, Image} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Canvas, RoundedRect, Shadow, LinearGradient, vec} from '@shopify/react-native-skia';
import {useColors} from '@/theme';

interface Component_1_2_Props {
  prop1: number;
  prop2: string; // imageUri
  prop3: 'optionA' | 'optionB' | 'optionC';
  prop4: 'modeX' | 'modeY' | 'modeZ';
  prop5: number; // angle
  prop6: number; // angle
  prop7: number; // angle
  prop8: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const Component_1_2: React.FC<Component_1_2_Props> = ({
  prop1,
  prop2,
  prop3,
  prop4,
  prop5,
  prop6,
  prop7,
  prop8,
  children,
  onPress,
  onLongPress,
}) => {
  const colors = useColors();

  // Animation values
  const focusProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const dismissX = useSharedValue(0);
  const revealProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);

  // Gesture: Tap
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      pressScale.value = withSpring(0.96, {stiffness: 240, damping: 18});
      if (onPress) {
        runOnJS(onPress)();
      }
    })
    .onEnd(() => {
      pressScale.value = withSpring(1, {stiffness: 240, damping: 18});
    });

  // Gesture: Long Press
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      focusProgress.value = withTiming(1, {duration: 260});
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    })
    .onEnd(() => {
      focusProgress.value = withTiming(0, {duration: 260});
    });

  // Gesture: Pan
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      dismissX.value = event.translationX;
    })
    .onEnd(() => {
      dismissX.value = withSpring(0, {stiffness: 280, damping: 20});
    });

  const composedGesture = Gesture.Simultaneous(
    tapGesture,
    longPressGesture,
    panGesture
  );

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: pressScale.value},
      {translateX: dismissX.value},
      {rotate: `${prop5 + focusProgress.value * prop6}deg`},
    ],
    opacity: prop8 ? 1 : 0.7 + 0.3 * focusProgress.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.container, animatedStyle]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Scrollable card component with ${prop3} option`}
        accessibilityHint="Tap to activate, long press for options, pan to dismiss">
        <Canvas style={{width: prop1 * 2, height: prop1 * 1.5}}>
          <RoundedRect x={0} y={0} width={prop1 * 2} height={prop1 * 1.5} r={12}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(prop1 * 2, prop1 * 1.5)}
              colors={[colors.primary, colors.primaryDark]}
            />
            <Shadow dx={0} dy={4} blur={8} color="rgba(0,0,0,0.15)" />
          </RoundedRect>
        </Canvas>
        {prop2 && (
          <Image
            source={{uri: prop2}}
            style={[styles.image, {width: prop1, height: prop1}]}
            accessibilityIgnoresInvertColors
          />
        )}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>
          {children}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 8,
    marginBottom: 8,
  },
});

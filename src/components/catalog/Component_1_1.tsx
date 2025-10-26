/**
 * Component 1.1 - Reusable UI Component
 * Props: angle, length, boolean, angle, angle, color, angle, enum
 * Gestures: fling, doubleTap, doubleTap, hover
 * Animations: onFocusTransition, onPressScaleSpring, onDismissSwipe, onRevealFling
 */

import React, {useCallback} from 'react';
import {View, StyleSheet, AccessibilityInfo} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Canvas, Rect, Shadow, LinearGradient, vec} from '@shopify/react-native-skia';
import {useColors} from '@/theme';

interface Component_1_1_Props {
  prop1: number; // angle
  prop2: number; // length
  prop3: boolean;
  prop4: number; // angle
  prop5: number; // angle
  prop6: string; // color
  prop7: number; // angle
  prop8: 'option1' | 'option2' | 'option3'; // enum
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Component_1_1: React.FC<Component_1_1_Props> = ({
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
}) => {
  const colors = useColors();

  // Shared values for animations
  const focusProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const dismissX = useSharedValue(0);
  const revealProgress = useSharedValue(0);
  const isHovered = useSharedValue(0);

  // Animation worklet: onFocusTransition
  const animateFocus = useCallback((focused: boolean) => {
    focusProgress.value = withTiming(focused ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  // Animation worklet: onPressScaleSpring
  const onPressScaleSpring = useCallback(() => {
    pressScale.value = withSpring(0.94, {
      stiffness: 240,
      damping: 18,
    });
    pressScale.value = withSpring(1, {
      stiffness: 240,
      damping: 18,
    });
  }, []);

  // Gesture: Fling
  const flingGesture = Gesture.Fling()
    .direction(Gesture.DIRECTION_RIGHT)
    .onStart(() => {
      revealProgress.value = withSpring(1, {stiffness: 280, damping: 20});
    });

  // Gesture: Double Tap
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(onPressScaleSpring)();
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  // Gesture: Hover (for pointer devices)
  const hoverGesture = Gesture.Hover()
    .onBegin(() => {
      isHovered.value = withTiming(1, {duration: 150});
    })
    .onFinalize(() => {
      isHovered.value = withTiming(0, {duration: 150});
    });

  // Compose gestures
  const composedGesture = Gesture.Race(
    doubleTapGesture,
    flingGesture,
    hoverGesture
  );

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: pressScale.value},
        {translateX: dismissX.value},
        {rotate: `${prop1 + focusProgress.value * 5}deg`},
      ],
      opacity: 0.75 + 0.25 * focusProgress.value,
    };
  });

  const skiaAnimatedProps = useAnimatedStyle(() => ({
    shadowOpacity: 0.1 + 0.15 * isHovered.value,
    shadowRadius: 4 + 8 * isHovered.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.container, animatedStyle]}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Interactive component 1.1"
        accessibilityHint="Double tap to activate, swipe right to reveal">
        <Canvas style={{width: prop2, height: prop2}}>
          {/* Skia-based visual effects */}
          <Rect x={0} y={0} width={prop2} height={prop2}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(prop2, prop2)}
              colors={[prop6, colors.primary]}
            />
            <Shadow dx={0} dy={2} blur={4} color="rgba(0,0,0,0.2)" />
          </Rect>
        </Canvas>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

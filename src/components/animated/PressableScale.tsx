/**
 * PressableScale - Animated pressable with scale feedback
 * Used throughout the app for interactive elements
 */

import React from 'react';
import {Pressable, PressableProps, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  hapticFeedback?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  scaleValue = 0.96,
  hapticFeedback = true,
  springConfig = {stiffness: 240, damping: 18},
  style,
  disabled,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(scaleValue, springConfig);
      opacity.value = withTiming(0.75, {duration: 100});

      if (hapticFeedback) {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: false,
          ignoreAndroidSystemSettings: false,
        });
      }
    })
    .onEnd((_, success) => {
      scale.value = withSpring(1, springConfig);
      opacity.value = withTiming(1, {duration: 100});

      if (success && onPress) {
        onPress({} as any);
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1, springConfig);
      opacity.value = withTiming(1, {duration: 100});
    })
    .enabled(!disabled);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedPressable
        style={[style, animatedStyle]}
        disabled={disabled}
        {...props}>
        {children}
      </AnimatedPressable>
    </GestureDetector>
  );
};

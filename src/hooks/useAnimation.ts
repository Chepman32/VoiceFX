/**
 * Animation Hooks - Reusable animation patterns
 */

import {useEffect} from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

// Spring configuration presets
export const springPresets = {
  gentle: {stiffness: 180, damping: 20} as WithSpringConfig,
  default: {stiffness: 240, damping: 18} as WithSpringConfig,
  bouncy: {stiffness: 300, damping: 15} as WithSpringConfig,
  snappy: {stiffness: 400, damping: 25} as WithSpringConfig,
};

// Timing configuration presets
export const timingPresets = {
  fast: {duration: 150, easing: Easing.out(Easing.cubic)} as WithTimingConfig,
  default: {duration: 260, easing: Easing.out(Easing.cubic)} as WithTimingConfig,
  slow: {duration: 400, easing: Easing.out(Easing.cubic)} as WithTimingConfig,
  linear: {duration: 260, easing: Easing.linear} as WithTimingConfig,
};

/**
 * Hook for fade-in animation
 */
export const useFadeIn = (duration = 260, delay = 0) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    }, () => {
      // Animation complete
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {opacity, animatedStyle};
};

/**
 * Hook for scale animation
 */
export const useScaleAnimation = (config: WithSpringConfig = springPresets.default) => {
  const scale = useSharedValue(1);

  const scaleIn = () => {
    scale.value = withSpring(0.96, config);
  };

  const scaleOut = () => {
    scale.value = withSpring(1, config);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return {scale, scaleIn, scaleOut, animatedStyle};
};

/**
 * Hook for slide-in animation
 */
export const useSlideIn = (
  from: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  distance = 100,
  config = springPresets.default
) => {
  const translateX = useSharedValue(from === 'left' ? -distance : from === 'right' ? distance : 0);
  const translateY = useSharedValue(from === 'top' ? -distance : from === 'bottom' ? distance : 0);

  useEffect(() => {
    translateX.value = withSpring(0, config);
    translateY.value = withSpring(0, config);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  return {translateX, translateY, animatedStyle};
};

/**
 * Hook for rotate animation
 */
export const useRotate = (config = timingPresets.default) => {
  const rotation = useSharedValue(0);

  const rotate = (degrees: number) => {
    rotation.value = withTiming(degrees, config);
  };

  const reset = () => {
    rotation.value = withTiming(0, config);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return {rotation, rotate, reset, animatedStyle};
};

/**
 * Hook for pulse animation (heartbeat effect)
 */
export const usePulse = (minScale = 0.95, maxScale = 1.05, duration = 1000) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, {duration: duration / 2}),
        withTiming(minScale, {duration: duration / 2})
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return {scale, animatedStyle};
};

/**
 * Hook for shimmer animation (loading effect)
 */
export const useShimmer = (duration = 1500) => {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(200, {duration, easing: Easing.linear}),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return {translateX, animatedStyle};
};

/**
 * Hook for progress animation
 */
export const useProgress = (config = timingPresets.default) => {
  const progress = useSharedValue(0);

  const setProgress = (value: number) => {
    progress.value = withTiming(value, config);
  };

  const reset = () => {
    progress.value = withTiming(0, timingPresets.fast);
  };

  return {progress, setProgress, reset};
};

/**
 * Hook for spring press animation (common pattern)
 */
export const useSpringPress = (
  scaleValue = 0.96,
  config = springPresets.default
) => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(scaleValue, config);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, config);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return {scale, onPressIn, onPressOut, animatedStyle};
};

/**
 * Hook for gesture-driven animation value
 */
export const useGestureValue = (initialValue = 0) => {
  const value = useSharedValue(initialValue);

  const animateTo = (target: number, config: WithSpringConfig | WithTimingConfig = springPresets.default) => {
    if ('stiffness' in config) {
      value.value = withSpring(target, config);
    } else {
      value.value = withTiming(target, config);
    }
  };

  const reset = () => {
    value.value = withSpring(initialValue, springPresets.default);
  };

  return {value, animateTo, reset};
};

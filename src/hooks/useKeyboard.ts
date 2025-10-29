/**
 * Keyboard Hook - Track keyboard visibility and height
 */

import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent, Platform} from 'react-native';
import {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';

export const useKeyboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        setIsVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
        animatedHeight.value = withSpring(event.endCoordinates.height, {
          stiffness: 240,
          damping: 20,
        });
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsVisible(false);
        setKeyboardHeight(0);
        animatedHeight.value = withSpring(0, {
          stiffness: 240,
          damping: 20,
        });
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: animatedHeight.value,
  }));

  return {
    isVisible,
    keyboardHeight,
    animatedHeight,
    animatedStyle,
    dismiss: Keyboard.dismiss,
  };
};

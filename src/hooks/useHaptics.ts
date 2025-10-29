/**
 * Haptics Hook - Provides haptic feedback functionality
 */

import {useCallback} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {usePreferences} from '@/store';

type HapticType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'selection';

export const useHaptics = () => {
  const preferences = usePreferences();

  const trigger = useCallback(
    (type: HapticType = 'impactLight') => {
      if (!preferences.hapticsEnabled) {
        return;
      }

      ReactNativeHapticFeedback.trigger(type, {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
      });
    },
    [preferences.hapticsEnabled]
  );

  const impactLight = useCallback(() => trigger('impactLight'), [trigger]);
  const impactMedium = useCallback(() => trigger('impactMedium'), [trigger]);
  const impactHeavy = useCallback(() => trigger('impactHeavy'), [trigger]);
  const notificationSuccess = useCallback(() => trigger('notificationSuccess'), [trigger]);
  const notificationWarning = useCallback(() => trigger('notificationWarning'), [trigger]);
  const notificationError = useCallback(() => trigger('notificationError'), [trigger]);
  const selection = useCallback(() => trigger('selection'), [trigger]);

  return {
    trigger,
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationWarning,
    notificationError,
    selection,
  };
};

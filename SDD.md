# VoiceFX — Offline Voice Effects & Editor

> Production-ready SDD for a **fully offline** iOS-first app built with **React Native**, **Reanimated**, and **React Native Skia**. This document emphasizes exhaustive **UI/UX**, gesture-first navigation, rich animated micro-interactions, local-only data, and IAP monetization. All features are implementable with JavaScript/React Native tooling. No external APIs required.

## 1. Product Overview

Apply voice effects (pitch, formant, reverb), trim, and mix offline.

### 1.1 Value Propositions

- Works entirely offline; deterministic behavior regardless of connectivity.
- Gesture-oriented UX with physics-based animations.
- Privacy-first: user data never leaves device unless explicitly exported.
- Designed to be shippable in production.

### 1.2 Non-Goals

- No social graph, no cloud sync, no server-side compute.
- No time estimations in UI or docs.

## 2. Platform & Stack

- **React Native** 0.75+, TypeScript, New Architecture (Fabric/TurboModules).
- **Navigation**: react-navigation (native-stack + custom gesture pager).
- **Animation**: react-native-reanimated 3, react-native-gesture-handler.
- **Rendering**: @shopify/react-native-skia for custom visuals, particles, charts.
- **Storage**: SQLite (WatermelonDB/Drizzle-RN) + RNFS for binary assets.
- **Local Notifications**: UNUserNotificationCenter via RN bridge.
- **IAP**: react-native-iap (consumables, non-consumables, subscriptions).
- Standard modules as listed; no network components.

## 3. Information Architecture

Core sections, editor, library, export, settings.

## 4. UI/UX — Screen-by-Screen

Detailed editor, library, and export screens with gesture-first UX and animations.

## 5. Visual System

- **Color tokens**: Accessible palette with light/dark variants; semantic colors for success/warning/info.
- **Typography**: SF Pro Text/Display with dynamic type scaling.
- **Iconography**: Vector icons rendered via Skia; no emoji usage.
- **Layout**: 8pt spacing grid; safe-area aware; large-hit targets.

## 6. Motion & Interactions

- Gesture-first navigation: edge swipes, pan-to-expand, pull-to-reveal.
- Micro-interactions: press springs (scale 0.96→1), card morphs, parallax headers.
- Splash: physics-based animated breakdown of the logo, particles reassemble (Skia).

## 7. Local Data Model

Core entities defined for this domain (see main description).

## 8. State Management (Recommendations)

Zustand slices per feature with selectors.

## 9. Monetization (IAP)

Pro unlock and packs depending on app domain.

## 10. Performance Budgets

Optimized rendering, caching, and background processing.

## 11. Offline-First Guarantees

Entirely offline by design.

---

## Appendix 1: Expanded UI Component Catalog

### Component 1.1
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=angle, prop2: type=length, prop3: type=boolean, prop4: type=angle, prop5: type=angle, prop6: type=color, prop7: type=angle, prop8: type=enum
- **Gestures**: fling, doubleTap, doubleTap, hover
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.2
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=number, prop2: type=imageUri, prop3: type=enum, prop4: type=enum, prop5: type=angle, prop6: type=angle, prop7: type=angle, prop8: type=boolean
- **Gestures**: scroll, pan, tap, longPress
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.3
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=icon, prop2: type=number, prop3: type=boolean, prop4: type=imageUri, prop5: type=boolean, prop6: type=boolean, prop7: type=string, prop8: type=angle
- **Gestures**: pinch, edgeSwipe, edgeSwipe, longPress
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.4
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=enum, prop2: type=color, prop3: type=color, prop4: type=string, prop5: type=opacity, prop6: type=color, prop7: type=boolean, prop8: type=length
- **Gestures**: hover, fling, doubleTap, pan
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.5
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=icon, prop2: type=opacity, prop3: type=color, prop4: type=string, prop5: type=length, prop6: type=number, prop7: type=color, prop8: type=opacity
- **Gestures**: pinch, pressAndHold, scroll, longPress
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.6
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=number, prop2: type=enum, prop3: type=boolean, prop4: type=length, prop5: type=imageUri, prop6: type=angle, prop7: type=length, prop8: type=icon
- **Gestures**: longPress, tap, edgeSwipe, fling
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.7
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=icon, prop2: type=length, prop3: type=string, prop4: type=opacity, prop5: type=icon, prop6: type=imageUri, prop7: type=icon, prop8: type=opacity
- **Gestures**: pinch, doubleTap, edgeSwipe, pan
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.8
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=imageUri, prop2: type=opacity, prop3: type=enum, prop4: type=opacity, prop5: type=boolean, prop6: type=enum, prop7: type=boolean, prop8: type=boolean
- **Gestures**: pinch, hover, pressAndHold, fling
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.9
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=opacity, prop2: type=angle, prop3: type=angle, prop4: type=icon, prop5: type=opacity, prop6: type=icon, prop7: type=string, prop8: type=imageUri
- **Gestures**: drag, pinch, tap, hover
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.10
- **Purpose**: Reusable building block used across multiple screens to maintain visual consistency and reduce duplication.
- **Props**: prop1: type=number, prop2: type=string, prop3: type=string, prop4: type=string, prop5: type=length, prop6: type=length, prop7: type=number, prop8: type=opacity
- **Gestures**: scroll, drag, scroll, longPress
- **Animation hooks (Reanimated worklets)**: `onFocusTransition`, `onPressScaleSpring`, `onDismissSwipe`, `onRevealFling`.
- **Skia usage**: vector icon rendering; elevation shadows; gradient fills; path morph for state changes.
- **Accessibility**: descriptive accessibilityLabel, traits/roles; supports Dynamic Type; VoiceOver focus order.
- **Offline behavior**: deterministic rendering with cached assets only.

### Component 1.11-1.70
[Components 1.11 through 1.70 follow the same pattern with varying prop types, gestures, and animations. Each component includes:
- Unique prop combinations (angle, length, boolean, color, enum, icon, imageUri, string, number, opacity)
- 4 gesture handlers from: tap, doubleTap, longPress, pan, pinch, fling, drag, scroll, edgeSwipe, hover, pressAndHold
- 4 animation worklets: onFocusTransition, onPressScaleSpring, onDismissSwipe, onRevealFling
- Skia rendering: shadows, gradients, path morphs
- Full accessibility support]

---

## Appendix 2: Motion Specification Snippets

**Motion 1-1 through 1-10**
- **Trigger**: user gesture
- **Duration**: 220–360ms (eased); spring stiffness 180–320, damping 14–22
- **Reanimated pseudo-code**:
  ```ts
  const t = useSharedValue(0);
  const onGesture = useAnimatedGestureHandler({
    onStart: () => { t.value = withSpring(1, { stiffness: 240, damping: 18 }) },
    onEnd: () => { t.value = withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) }) },
  });
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.06 * t.value }, { translateY: -8 * t.value }],
    opacity: 0.75 + 0.25 * t.value
  }));
  ```
- **Skia drawing**: interpolate shadow sigma and elevation with `t` for depth illusion; use clipped rounded rectangles for smooth reveals.

---

## Appendix 3: Local Data Samples (truncated)

- Sample 1.1: { id: '1-1', title: 'Local entity 1', updatedAt: '2025-03-02T10:00:00Z', offline: true }
- Sample 1.2: { id: '1-2', title: 'Local entity 2', updatedAt: '2025-03-03T10:00:00Z', offline: true }
- Sample 1.3-1.20: [Additional sample data entities following the same pattern]

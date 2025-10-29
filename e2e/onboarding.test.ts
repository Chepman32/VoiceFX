/**
 * E2E Tests - Onboarding Flow
 */

import {device, element, by, expect as detoxExpect} from 'detox';

describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {notifications: 'YES', microphone: 'YES'},
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display splash screen', async () => {
    // Wait for splash screen
    await detoxExpect(element(by.text('VoiceFX'))).toBeVisible();
  });

  it('should navigate through onboarding slides', async () => {
    // Wait for splash to disappear and onboarding to appear
    await waitFor(element(by.text('Voice Effects')))
      .toBeVisible()
      .withTimeout(5000);

    // First slide
    await detoxExpect(element(by.text('Voice Effects'))).toBeVisible();
    await detoxExpect(element(by.text('Apply amazing voice effects to your recordings'))).toBeVisible();

    // Tap Next
    await element(by.text('Next')).tap();

    // Second slide
    await detoxExpect(element(by.text('Offline First'))).toBeVisible();

    // Tap Next
    await element(by.text('Next')).tap();

    // Third slide
    await detoxExpect(element(by.text('Easy to Use'))).toBeVisible();

    // Tap Get Started
    await element(by.text('Get Started')).tap();

    // Should navigate to home screen
    await waitFor(element(by.text('Welcome to VoiceFX')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should allow skipping onboarding', async () => {
    await device.launchApp({newInstance: true});

    // Wait for onboarding
    await waitFor(element(by.text('Skip')))
      .toBeVisible()
      .withTimeout(5000);

    // Tap Skip
    await element(by.text('Skip')).tap();

    // Should navigate to home screen
    await waitFor(element(by.text('Welcome to VoiceFX')))
      .toBeVisible()
      .withTimeout(2000);
  });
});

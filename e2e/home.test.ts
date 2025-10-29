/**
 * E2E Tests - Home Screen
 */

import {device, element, by, expect as detoxExpect, waitFor} from 'detox';

describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Complete onboarding if needed
    try {
      await element(by.text('Skip')).tap();
    } catch (e) {
      // Already completed
    }
  });

  it('should display home screen elements', async () => {
    await waitFor(element(by.text('Welcome to VoiceFX')))
      .toBeVisible()
      .withTimeout(5000);

    await detoxExpect(element(by.text('Create amazing voice effects offline'))).toBeVisible();
    await detoxExpect(element(by.text('New Project'))).toBeVisible();
  });

  it('should navigate to new project', async () => {
    await element(by.text('New Project')).tap();

    // Should navigate to editor
    await waitFor(element(by.text('New Project')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should show Pro upsell for free users', async () => {
    await waitFor(element(by.text('Upgrade to Pro')))
      .toBeVisible()
      .withTimeout(2000);

    await detoxExpect(element(by.text('Unlock all effects, remove limits, and support development'))).toBeVisible();
  });

  it('should navigate to Pro screen', async () => {
    await element(by.text('Upgrade to Pro')).tap();

    await waitFor(element(by.text('Upgrade to Pro')))
      .toBeVisible()
      .withTimeout(2000);

    await detoxExpect(element(by.text('Unlock the full potential of VoiceFX'))).toBeVisible();

    // Go back
    await device.pressBack(); // Android
    // await element(by.traits(['button']).and(by.label('Back'))).tap(); // iOS
  });

  it('should display empty state when no projects', async () => {
    // Scroll down to projects section
    await element(by.id('home-scroll')).scrollTo('bottom');

    await detoxExpect(element(by.text('Recent Projects'))).toBeVisible();
    await detoxExpect(element(by.text('No projects yet. Create your first project to get started!'))).toBeVisible();
  });
});

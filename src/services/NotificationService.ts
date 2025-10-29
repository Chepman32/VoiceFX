/**
 * Notification Service - Local notification management
 * Handles scheduling, canceling, and managing local notifications
 */

import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification-ios';
import {db} from '@/database/client';
import {NotificationSchedule} from '@/types/common';

class NotificationService {
  private initialized = false;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (Platform.OS === 'ios') {
      // Request permissions for iOS
      PushNotification.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      }).then(permissions => {
        console.log('✓ Notification permissions granted:', permissions);
      });

      // Register for notifications
      PushNotification.addEventListener('register', token => {
        console.log('✓ Device token:', token);
      });

      PushNotification.addEventListener('notification', notification => {
        this.handleNotification(notification);
      });

      PushNotification.addEventListener('localNotification', notification => {
        this.handleNotification(notification);
      });
    }

    this.initialized = true;
  }

  /**
   * Schedule a local notification
   */
  async scheduleNotification(notification: NotificationSchedule): Promise<void> {
    try {
      // Save to database
      await db.execute(
        `INSERT INTO notifications (id, title, body, scheduled_date, is_recurring, recurrence_pattern, created_at, is_sent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notification.id,
          notification.title,
          notification.body,
          notification.scheduledDate,
          notification.isRecurring ? 1 : 0,
          notification.recurrencePattern || null,
          new Date().toISOString(),
          0,
        ]
      );

      if (Platform.OS === 'ios') {
        PushNotification.addNotificationRequest({
          id: notification.id,
          title: notification.title,
          body: notification.body,
          fireDate: new Date(notification.scheduledDate),
          repeats: notification.isRecurring,
          sound: 'default',
        });
      }

      console.log('✓ Notification scheduled:', notification.id);
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      // Update database
      await db.execute(
        'DELETE FROM notifications WHERE id = ?',
        [notificationId]
      );

      if (Platform.OS === 'ios') {
        PushNotification.removePendingNotificationRequests([notificationId]);
      }

      console.log('✓ Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ Failed to cancel notification:', error);
      throw error;
    }
  }

  /**
   * Get all pending notifications
   */
  async getPendingNotifications(): Promise<NotificationSchedule[]> {
    try {
      const notifications = await db.query<any>(
        'SELECT * FROM notifications WHERE is_sent = 0 ORDER BY scheduled_date ASC'
      );

      return notifications.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        scheduledDate: n.scheduled_date,
        isRecurring: n.is_recurring === 1,
        recurrencePattern: n.recurrence_pattern,
      }));
    } catch (error) {
      console.error('❌ Failed to get pending notifications:', error);
      return [];
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await db.execute('DELETE FROM notifications WHERE is_sent = 0');

      if (Platform.OS === 'ios') {
        PushNotification.removeAllPendingNotificationRequests();
      }

      console.log('✓ All notifications cancelled');
    } catch (error) {
      console.error('❌ Failed to cancel all notifications:', error);
      throw error;
    }
  }

  /**
   * Handle received notification
   */
  private handleNotification(notification: any): void {
    console.log('📬 Notification received:', notification);

    // Mark as sent in database
    if (notification.identifier) {
      db.execute(
        'UPDATE notifications SET is_sent = 1 WHERE id = ?',
        [notification.identifier]
      ).catch(error => {
        console.error('Failed to mark notification as sent:', error);
      });
    }

    // Complete notification (iOS)
    if (notification.finish) {
      notification.finish(PushNotification.FetchResult.NoData);
    }
  }

  /**
   * Schedule reminder for project
   */
  async scheduleProjectReminder(
    projectId: string,
    projectTitle: string,
    reminderDate: Date
  ): Promise<void> {
    const notification: NotificationSchedule = {
      id: `project_reminder_${projectId}_${Date.now()}`,
      title: 'Project Reminder',
      body: `Don't forget to work on "${projectTitle}"`,
      scheduledDate: reminderDate.toISOString(),
      isRecurring: false,
    };

    await this.scheduleNotification(notification);
  }

  /**
   * Schedule daily tip notification
   */
  async scheduleDailyTip(hour: number = 10, minute: number = 0): Promise<void> {
    const tips = [
      'Try combining multiple effects for unique sounds!',
      'Use the favorite feature to quickly access your best projects.',
      'Export your projects in multiple formats.',
      'Experiment with different reverb settings for atmosphere.',
      'Long press on a project for more options.',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    const notification: NotificationSchedule = {
      id: `daily_tip_${Date.now()}`,
      title: 'VoiceFX Tip',
      body: randomTip,
      scheduledDate: new Date(
        new Date().setHours(hour, minute, 0, 0)
      ).toISOString(),
      isRecurring: true,
      recurrencePattern: 'daily',
    };

    await this.scheduleNotification(notification);
  }

  /**
   * Check notification permissions
   */
  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const settings = await PushNotification.checkPermissions();
      return settings.alert && settings.badge && settings.sound;
    }
    return true; // Android permissions handled at install time
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const permissions = await PushNotification.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });
      return permissions.alert && permissions.badge && permissions.sound;
    }
    return true;
  }
}

export const notificationService = new NotificationService();

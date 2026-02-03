import { Platform } from 'react-native';

// Singleton notification manager
class NotificationManagerClass {
  constructor() {
    this.webListeners = [];
    this.currentNotification = null;
    this.nativeModule = null;
    this.initialized = false;
  }

  // Initialize native notifications (iOS/Android)
  async initializeNative() {
    if (Platform.OS === 'web' || this.initialized) return;
    
    try {
      const Notifications = await import('expo-notifications');
      this.nativeModule = Notifications;
      
      // Request permissions on native platforms
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Notification permissions not granted');
      }
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize native notifications: ${error.message}`);
    }
  }

  // Subscribe to web notifications (for overlay)
  subscribeWeb(listener) {
    this.webListeners.push(listener);
    return () => {
      this.webListeners = this.webListeners.filter(l => l !== listener);
    };
  }

  // Notify all web listeners
  notifyWebListeners(notification) {
    this.currentNotification = notification;
    this.webListeners.forEach(listener => listener(notification));
  }

  // Show notification based on platform
  async show({ title, body, type = 'info', duration = 4000 }) {
    if (Platform.OS === 'web') {
      // Web: Use custom overlay
      this.notifyWebListeners({ title, body, type, duration });
    } else {
      // iOS/Android: Use system notifications
      if (!this.initialized) {
        await this.initializeNative();
      }
      
      if (!this.nativeModule) {
        throw new Error('Native notifications module not available');
      }
      
      await this.nativeModule.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    }
  }

  // Dismiss current notification (web only)
  dismiss() {
    if (Platform.OS === 'web') {
      this.currentNotification = null;
      this.webListeners.forEach(listener => listener(null));
    }
  }

  // Convenience methods for different notification types
  async success(title, body) {
    await this.show({ title, body, type: 'success' });
  }

  async error(title, body) {
    await this.show({ title, body, type: 'error' });
  }

  async warning(title, body) {
    await this.show({ title, body, type: 'warning' });
  }

  async info(title, body) {
    await this.show({ title, body, type: 'info' });
  }
}

// Singleton instance
export const NotificationManager = new NotificationManagerClass();

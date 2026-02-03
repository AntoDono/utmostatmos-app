import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NotificationManager } from './NotificationManager';

// Native platforms (iOS/Android) use system notifications
// This component only initializes the notification module
export const NotificationOverlay = () => {
  useEffect(() => {
    // Initialize native notifications on mount
    if (Platform.OS !== 'web') {
      NotificationManager.initializeNative().catch((error) => {
        console.error('Failed to initialize notifications:', error);
      });
    }
  }, []);

  // Native platforms don't render an overlay - they use system notifications
  return null;
};

export default NotificationOverlay;

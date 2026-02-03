import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { NotificationManager } from './NotificationManager';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const NOTIFICATION_COLORS = {
  success: {
    background: '#D4EDDA',
    border: '#28A745',
    text: '#155724',
    icon: '✓',
  },
  error: {
    background: '#F8D7DA',
    border: '#DC3545',
    text: '#721C24',
    icon: '✕',
  },
  warning: {
    background: '#FFF3CD',
    border: '#FFC107',
    text: '#856404',
    icon: '⚠',
  },
  info: {
    background: '#D1ECF1',
    border: '#17A2B8',
    text: '#0C5460',
    icon: 'ℹ',
  },
};

export const NotificationOverlay = () => {
  const [notification, setNotification] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const hideNotification = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
      NotificationManager.dismiss();
    });
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribeWeb((notif) => {
      if (notif) {
        setNotification(notif);
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto-dismiss after duration
        const timer = setTimeout(() => {
          hideNotification();
        }, notif.duration || 4000);

        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, [fadeAnim, slideAnim, hideNotification]);

  if (!notification) {
    return null;
  }

  const colorScheme = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.info;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.notification,
          {
            backgroundColor: colorScheme.background,
            borderLeftColor: colorScheme.border,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: colorScheme.border }]}>
            {colorScheme.icon}
          </Text>
        </View>
        <View style={styles.content}>
          {notification.title && (
            <Text style={[styles.title, { color: colorScheme.text }]}>
              {notification.title}
            </Text>
          )}
          {notification.body && (
            <Text style={[styles.body, { color: colorScheme.text }]}>
              {notification.body}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideNotification}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeText, { color: colorScheme.text }]}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: Math.min(500, width - 40),
    minWidth: 300,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
});

export default NotificationOverlay;

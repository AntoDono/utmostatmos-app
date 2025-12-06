import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

class AlertManager {
  constructor() {
    this.listeners = [];
    this.currentAlert = null;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  show(alert) {
    this.currentAlert = alert;
    this.listeners.forEach(listener => listener(this.currentAlert));
  }

  hide() {
    this.currentAlert = null;
    this.listeners.forEach(listener => listener(null));
  }
}

const alertManager = new AlertManager();

export const CustomAlert = () => {
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = alertManager.subscribe(setAlert);
    return unsubscribe;
  }, []);

  const handlePress = (onPress) => {
    if (onPress) {
      onPress();
    }
    alertManager.hide();
  };

  if (!alert) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={!!alert}
      animationType="fade"
      onRequestClose={() => alertManager.hide()}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {alert.title && (
            <Text style={styles.title}>{alert.title}</Text>
          )}
          {alert.message && (
            <Text style={styles.message}>{alert.message}</Text>
          )}
          <View style={styles.buttonContainer}>
            {alert.buttons && alert.buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  index > 0 && styles.buttonSpacing,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.destructiveButton,
                ]}
                onPress={() => handlePress(button.onPress)}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'cancel' && styles.cancelButtonText,
                  button.style === 'destructive' && styles.destructiveButtonText,
                ]}>
                  {button.text || 'OK'}
                </Text>
              </TouchableOpacity>
            ))}
            {(!alert.buttons || alert.buttons.length === 0) && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handlePress()}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const Alert = {
  alert: (title, message, buttons) => {
    alertManager.show({ title, message, buttons });
  },
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: colors.DARKGREEN,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: colors.GREY,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.LIGHTGREEN,
    minWidth: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacing: {
    marginLeft: 0,
  },
  cancelButton: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GREY,
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: colors.WHITE,
    textAlign: 'center',
  },
  cancelButtonText: {
    color: colors.GREY,
  },
  destructiveButtonText: {
    color: colors.WHITE,
  },
});


import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const responsiveSize = (size) => {
  const scale = width / 375;
  return Math.round(size * scale);
};

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
    padding: responsiveSize(20),
  },
  alertContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: responsiveSize(12),
    padding: responsiveSize(20),
    width: '100%',
    maxWidth: responsiveSize(320),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: responsiveSize(18),
    fontFamily: 'Montserrat-Bold',
    color: colors.DARKGREEN,
    marginBottom: responsiveSize(12),
    textAlign: 'center',
  },
  message: {
    fontSize: responsiveSize(16),
    fontFamily: 'Montserrat-Regular',
    color: colors.GREY,
    marginBottom: responsiveSize(20),
    textAlign: 'center',
    lineHeight: responsiveSize(22),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: responsiveSize(10),
    paddingHorizontal: responsiveSize(20),
    borderRadius: responsiveSize(8),
    backgroundColor: colors.LIGHTGREEN,
    minWidth: responsiveSize(80),
  },
  buttonSpacing: {
    marginLeft: responsiveSize(10),
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
    fontSize: responsiveSize(16),
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


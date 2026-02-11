import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, login, isAuthenticated, isLoggingOut, isLoggingIn } = useAuth();

  const menuItems = [
    { name: 'Home', route: '/home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Contests', route: '/contests', icon: 'school', iconOutline: 'school-outline' },
    { name: 'Quiz', route: '/quiz', icon: 'game-controller', iconOutline: 'game-controller-outline' },
    { name: 'Map', route: '/map', icon: 'map', iconOutline: 'map-outline' },
    { name: 'Leaderboard', route: '/leaderboard', icon: 'podium', iconOutline: 'podium-outline' },
    { name: 'Admin', route: '/admin', icon: 'settings', iconOutline: 'settings-outline' },
  ];

  const handleNavigation = (route) => {
    router.push(route);
    props.navigation.closeDrawer();
  };

  const handleLogin = async () => {
    try {
      await login();
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Login error:', error);
      // Don't close drawer if login was cancelled
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Always close drawer after logout (even if user cancelled Auth0 logout)
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Logout error:', error);
      // Still close drawer
      props.navigation.closeDrawer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.userIconContainer}>
            <Ionicons
              name={isAuthenticated ? "person-circle" : "person-circle-outline"}
              size={60}
              color={isAuthenticated ? colors.LIGHTGREEN : colors.GREY}
            />
          </View>
          {isAuthenticated ? (
            <>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </>
          ) : (
            <>
              <Text style={styles.userName}>Guest User</Text>
              <View style={styles.guestBadge}>
                <Ionicons name="eye-off-outline" size={14} color={colors.GREY} />
                <Text style={styles.guestBadgeText}>Not logged in</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons
                  name={isActive ? item.icon : item.iconOutline}
                  size={24}
                  color={isActive ? colors.LIGHTGREEN : colors.GREY}
                />
                <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Login/Logout Button */}
      <View style={styles.footer}>
        {isAuthenticated ? (
          <TouchableOpacity
            style={[styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={colors.GREY} />
            ) : (
              <Ionicons name="log-out-outline" size={24} color={colors.GREY} />
            )}
            <Text style={[styles.logoutText, isLoggingOut && styles.textDisabled]}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.loginButton, isLoggingIn && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator size="small" color={colors.LIGHTGREEN} />
            ) : (
              <Ionicons name="log-in-outline" size={24} color={colors.LIGHTGREEN} />
            )}
            <Text style={[styles.loginText, isLoggingIn && styles.textDisabled]}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    backgroundColor: colors.LIGHTERGREY,
    marginBottom: 10,
  },
  userIconContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: colors.BLACK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.GREY,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHTERGREY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: colors.GREY,
    marginLeft: 6,
  },
  menuSection: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: colors.LIGHTERGREY,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.GREY,
    marginLeft: 16,
  },
  menuTextActive: {
    color: colors.LIGHTGREEN,
    fontFamily: 'Montserrat-Bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.GREY,
    marginLeft: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.LIGHTERGREY,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: colors.LIGHTGREEN,
    marginLeft: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textDisabled: {
    color: colors.buttonDisabled,
  },
});

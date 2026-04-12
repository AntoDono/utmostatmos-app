import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Modal, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function CustomHeader({ title }) {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, isAuthenticated, loginWithGoogle, logout, isLoggingIn, isLoggingOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={28} color={colors.DARKGREEN} />
        </TouchableOpacity>

        <View style={styles.titleWrap} pointerEvents="box-none">
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Profile avatar top right */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowProfileMenu(true)}
          hitSlop={8}
        >
          {user?.picture ? (
            <Image source={{ uri: user.picture }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={28} color={colors.DARKGREEN} />
          )}
        </TouchableOpacity>
      </View>

      {/* Profile dropdown menu */}
      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <Pressable style={styles.profileOverlay} onPress={() => setShowProfileMenu(false)}>
          <View style={styles.profileMenuCard}>
            {isAuthenticated ? (
              <>
                <View style={styles.profileHeader}>
                  {user?.picture && (
                    <Image source={{ uri: user.picture }} style={styles.menuAvatar} />
                  )}
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.profileName} numberOfLines={1}>
                      {user?.name || 'Signed in'}
                    </Text>
                    <Text style={styles.profileSubtitle}>Account & identity</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push('/account');
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={colors.DARKGREEN} />
                  <Text style={styles.profileMenuText}>My Account</Text>
                </TouchableOpacity>

                {/* Change profile picture — coming soon
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                  }}
                >
                  <Ionicons name="image-outline" size={20} color={colors.DARKGREEN} />
                  <Text style={styles.profileMenuText}>Change profile picture (coming soon)</Text>
                </TouchableOpacity>
                */}

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={async () => {
                    if (isLoggingOut) return;
                    setShowProfileMenu(false);
                    await logout();
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#c0392b" />
                  <Text style={[styles.profileMenuText, { color: '#c0392b' }]}>Log out</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={async () => {
                    if (isLoggingIn) return;
                    setShowProfileMenu(false);
                    await loginWithGoogle();
                  }}
                >
                  <Ionicons name="log-in-outline" size={20} color={colors.DARKGREEN} />
                  <Text style={styles.profileMenuText}>Sign in / Create account</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.WHITE,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    width: 44,
  },
  profileButton: {
    width: 44,
    alignItems: 'flex-end',
  },
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: colors.DARKGREEN,
    textAlign: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  profileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: Platform.OS === 'web' ? 70 : 80,
  },
  profileMenuCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    minWidth: 260,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  menuAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.DARKGREEN,
  },
  profileSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  profileMenuText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});

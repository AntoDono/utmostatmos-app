import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';

export default function Account() {
  const router = useRouter();
  const { user, isAuthenticated, isAnonymous, getAccessToken, logout } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();
      const { user: profile } = await authAPI.getProfile(token);
      setFirstName(profile.firstName ?? '');
      setLastName(profile.lastName ?? '');
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!isAuthenticated || isAnonymous) {
      router.replace('/');
      return;
    }
    loadProfile();
  }, [isAuthenticated, isAnonymous]);

  const handleSave = async () => {
    if (saving) return;
    setError(null);
    setSuccess(false);
    try {
      setSaving(true);
      const token = await getAccessToken();
      await authAPI.updateProfile(token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleting) return;
    setShowDeleteModal(false);
    try {
      setDeleting(true);
      const token = await getAccessToken();
      await authAPI.deleteAccount(token);
      await logout();
      router.replace('/');
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.LIGHTGREEN} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Personal Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={22} color={colors.DARKGREEN} />
          <Text style={styles.cardTitle}>Personal Info</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{user?.email || '—'}</Text>
          </View>
          <Text style={styles.fieldHint}>Email is managed by your identity provider and cannot be changed here.</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.fieldHalf]}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(t) => { setFirstName(t); setSuccess(false); }}
              placeholder="First name"
              placeholderTextColor={colors.textLight}
              returnKeyType="next"
              autoCorrect={false}
            />
          </View>
          <View style={[styles.field, styles.fieldHalf]}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(t) => { setLastName(t); setSuccess(false); }}
              placeholder="Last name"
              placeholderTextColor={colors.textLight}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              autoCorrect={false}
            />
          </View>
        </View>

        {error && (
          <View style={styles.banner}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={styles.bannerTextError}>{error}</Text>
          </View>
        )}
        {success && (
          <View style={[styles.banner, styles.bannerSuccess]}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.bannerTextSuccess}>Profile saved.</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.WHITE} />
          ) : (
            <Text style={styles.saveButtonText}>Save changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={[styles.card, styles.dangerCard]}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning-outline" size={22} color={colors.error} />
          <Text style={[styles.cardTitle, styles.dangerTitle]}>Danger Zone</Text>
        </View>
        <Text style={styles.dangerDescription}>
          Permanently delete your account and all associated data including your scores and progress. This cannot be undone.
        </Text>
        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.buttonDisabled]}
          onPress={() => setShowDeleteModal(true)}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <>
              <Ionicons name="trash-outline" size={17} color={colors.error} />
              <Text style={styles.deleteButtonText}>Delete my account</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDeleteModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="warning" size={36} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Delete your account?</Text>
            <Text style={styles.modalBody}>
              All your data — scores, progress, and account info — will be permanently removed. There is no way to recover it.
            </Text>
            <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteConfirm}>
              <Text style={styles.modalDeleteText}>Yes, delete my account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 14,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Montserrat-Bold',
    color: colors.DARKGREEN,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    gap: 6,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: colors.text,
  },
  readOnlyInput: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  readOnlyText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: colors.textMuted,
  },
  fieldHint: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: colors.textLight,
    lineHeight: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerSuccess: {
    backgroundColor: colors.successLight,
  },
  bannerTextError: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: colors.error,
    flex: 1,
  },
  bannerTextSuccess: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: colors.success,
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.LIGHTGREEN,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    minHeight: 46,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: colors.WHITE,
  },
  // Danger zone
  dangerCard: {
    borderWidth: 1,
    borderColor: colors.errorLight,
  },
  dangerTitle: {
    color: colors.error,
  },
  dangerDescription: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: 10,
    paddingVertical: 12,
    minHeight: 46,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: colors.error,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    gap: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconWrap: {
    alignSelf: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: 40,
    padding: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: colors.text,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  modalDeleteButton: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  modalDeleteText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: colors.WHITE,
  },
  modalCancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
  },
});

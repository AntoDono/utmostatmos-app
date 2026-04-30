import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  ScrollView,
  Modal,
  Linking,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { authAPI, leaderboardAPI } from "../../utils/api";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const CONTACT_EMAIL = "admin@utmostatmos.org";

export default function Home() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showIconGuide, setShowIconGuide] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [streak, setStreak] = useState(0);
  const [rank, setRank] = useState(null);
  const [points, setPoints] = useState(null);

  // Fetch profile on load when authenticated; backend updates streak for consecutive logins
  useEffect(() => {
    if (!isAuthenticated) {
      setStreak(0);
      setRank(null);
      setPoints(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token || cancelled) return;

        // Profile: updates and returns streak
        const { user: profile } = await authAPI.getProfile(token);
        if (!cancelled && profile?.loginStreak != null) {
          setStreak(profile.loginStreak);
        }

        // Leaderboard: returns current user's global rank and score
        const leaderboard = await leaderboardAPI.getLeaderboard(token);
        if (!cancelled) {
          if (leaderboard.currentUserRank != null) {
            setRank(leaderboard.currentUserRank);
          } else {
            setRank(null);
          }
          if (leaderboard.currentUser?.leaderboardScore != null) {
            setPoints(leaderboard.currentUser.leaderboardScore);
          } else {
            setPoints(null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setStreak(0);
          setRank(null);
          setPoints(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, getAccessToken]);

  // Prefer first name from profile; fall back to given_name, nickname, or email prefix
  const name =
    (user?.name?.trim() && user.name.split(" ")[0]) ||
    user?.given_name ||
    user?.nickname ||
    (user?.email?.includes("@") ? user.email.split("@")[0] : null) ||
    "User";

  const openTutorial = () => {
    setShowHelpMenu(false);
    setShowTutorial(true);
  };

  const openIconGuide = () => {
    setShowHelpMenu(false);
    setShowIconGuide(true);
  };

  const openFeedbackForm = () => {
    setShowHelpMenu(false);
    setFeedbackText("");
    setShowFeedbackForm(true);
  };

  const handleContactEmail = () => {
    setShowHelpMenu(false);
    Linking.openURL(`mailto:${CONTACT_EMAIL}`).catch(() => { });
  };

  const submitFeedback = () => {
    setShowFeedbackForm(false);
    setFeedbackText("");
  };

  const showLeaderboardText = windowWidth >= 380;

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER (page-level help + logo only; profile is in global header now) */}
        <View style={styles.header}>

          <View style={styles.headerSlotLeft}>
            {/* Help (question mark in circle) - opens dropdown */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowHelpMenu(true)}
            >
              <Ionicons name="help-circle-outline" size={28} color="#2c3e50" />
            </TouchableOpacity>
          </View>

          {/* Logo - truly centered on screen */}
          <View style={styles.headerSlotCenter} pointerEvents="none">
            <Text style={styles.logo} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              Utmost Atmos
            </Text>
          </View>

          <View style={styles.headerSlotRight}>
            {/* Leaderboard button - top right, same spot as before */}
            <TouchableOpacity
              style={styles.leaderboardButton}
              onPress={() => router.push("/(tabs)/leaderboard")}
              accessibilityRole="button"
              accessibilityLabel="Leaderboard"
            >
              {showLeaderboardText ? (
                <Text
                  style={styles.leaderboardButtonText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  Leaderboard
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>

        </View>

        {/* WELCOME CARD */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back, {name} 👋</Text>

          <Text style={styles.subtitle}>
            Continue learning how to dispose waste properly and earn rewards.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="flame" size={22} color="#e67e22" />
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>

            <View style={styles.stat}>
              <FontAwesome name="trophy" size={20} color="#FFC107" />
              <Text style={styles.statNumber}>{points != null ? points : 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="people" size={22} color="#3498db" />
              <Text style={styles.statNumber}>
                {rank != null ? `#${rank}` : "--"}
              </Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>
        </View>

        {/* EXPLORE SECTION */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreSectionTitle}>Explore</Text>
          <View style={styles.exploreGrid}>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => router.push("/(tabs)/quiz")}
              activeOpacity={0.75}
            >
              <View style={[styles.exploreIconWrap, { backgroundColor: "#E8F5E9" }]}>
                <MaterialCommunityIcons name="recycle" size={28} color="#388E3C" />
              </View>
              <View style={styles.exploreCardFooter}>
                <Text style={styles.exploreCardTitle}>Quiz</Text>
                <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
              </View>
              <Text style={styles.exploreCardDesc}>Test your waste-sorting knowledge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => router.push("/(tabs)/contests")}
              activeOpacity={0.75}
            >
              <View style={[styles.exploreIconWrap, { backgroundColor: "#FFF8E1" }]}>
                <Ionicons name="school" size={28} color="#F9A825" />
              </View>
              <View style={styles.exploreCardFooter}>
                <Text style={styles.exploreCardTitle}>Contests</Text>
                <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
              </View>
              <Text style={styles.exploreCardDesc}>Join contests and earn rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => router.push("/(tabs)/map")}
              activeOpacity={0.75}
            >
              <View style={[styles.exploreIconWrap, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="map" size={28} color="#1976D2" />
              </View>
              <View style={styles.exploreCardFooter}>
                <Text style={styles.exploreCardTitle}>Map</Text>
                <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
              </View>
              <Text style={styles.exploreCardDesc}>Find recycling centers near you</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => router.push("/(tabs)/leaderboard")}
              activeOpacity={0.75}
            >
              <View style={[styles.exploreIconWrap, { backgroundColor: "#FCE4EC" }]}>
                <Ionicons name="podium" size={28} color="#C62828" />
              </View>
              <View style={styles.exploreCardFooter}>
                <Text style={styles.exploreCardTitle}>Leaderboard</Text>
                <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
              </View>
              <Text style={styles.exploreCardDesc}>See where you rank globally</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>

      {/* HELP DROPDOWN (top left) */}
      <Modal
        visible={showHelpMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelpMenu(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setShowHelpMenu(false)}>
          <View style={styles.helpMenuCard}>
            <TouchableOpacity style={styles.helpMenuItem} onPress={openIconGuide}>
              <Ionicons name="information-circle-outline" size={22} color="#2c3e50" />
              <Text style={styles.helpMenuText}>What each button does</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpMenuItem} onPress={openFeedbackForm}>
              <Ionicons name="chatbubble-outline" size={22} color="#2c3e50" />
              <Text style={styles.helpMenuText}>Give feedback or ask questions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpMenuItem} onPress={handleContactEmail}>
              <Ionicons name="mail-outline" size={22} color="#2c3e50" />
              <Text style={styles.helpMenuText}>Contact us: {CONTACT_EMAIL}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* TUTORIAL / USER GUIDE */}
      <Modal
        visible={showTutorial}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTutorial(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tutorial / User guide</Text>
              <TouchableOpacity onPress={() => setShowTutorial(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalParagraph}>
                Revisit the app tutorial and user guide here. Design team: add step-by-step content or link to a full guide.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* WHAT EACH BUTTON DOES (bubble/arrow copy from design team) */}
      <Modal
        visible={showIconGuide}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIconGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What each button does</Text>
              <TouchableOpacity onPress={() => setShowIconGuide(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalNote}>
                Design team: add descriptions and arrow graphics for each button/icon.
              </Text>
              <View style={styles.iconGuideList}>
                <View style={styles.iconGuideRow}>
                  <Ionicons name="home" size={24} color="#2ecc71" />
                  <Text style={styles.iconGuideLabel}>Home – main dashboard</Text>
                </View>
                <View style={styles.iconGuideRow}>
                  <MaterialCommunityIcons name="recycle" size={24} color="#2c3e50" />
                  <Text style={styles.iconGuideLabel}>Quiz – waste sorting game</Text>
                </View>
                <View style={styles.iconGuideRow}>
                  <Ionicons name="school" size={24} color="#2c3e50" />
                  <Text style={styles.iconGuideLabel}>Contests / Scholarships</Text>
                </View>
                <View style={styles.iconGuideRow}>
                  <Ionicons name="map" size={24} color="#2c3e50" />
                  <Text style={styles.iconGuideLabel}>Map – locations</Text>
                </View>
                <View style={styles.iconGuideRow}>
                  <Ionicons name="podium-outline" size={24} color="#2c3e50" />
                  <Text style={styles.iconGuideLabel}>Leaderboard – top right</Text>
                </View>
                <View style={styles.iconGuideRow}>
                  <Image source={{ uri: user?.picture || "https://i.pravatar.cc/100" }} style={styles.iconGuideAvatar} />
                  <Text style={styles.iconGuideLabel}>Profile – top right</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK FORM (direct/embedded) */}
      <Modal
        visible={showFeedbackForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeedbackForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Give feedback or ask a question</Text>
              <TouchableOpacity onPress={() => setShowFeedbackForm(false)} hitSlop={12}>
                <Ionicons name="close" size={28} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Your feedback or question..."
                placeholderTextColor="#95a5a6"
                multiline
                numberOfLines={4}
                value={feedbackText}
                onChangeText={setFeedbackText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.feedbackSubmitButton} onPress={submitFeedback}>
                <Text style={styles.feedbackSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f4f7f9",
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
  },

  headerSlotLeft: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    minWidth: 44,
  },

  headerSlotCenter: {
    flexShrink: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    maxWidth: "60%",
  },

  headerSlotRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 44,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
  },

  iconButton: {
    padding: 4,
  },

  headerRightSpacer: {
    width: 34,
  },

  leaderboardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    maxWidth: 140,
  },

  leaderboardButtonText: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "600",
    flexShrink: 1,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  exploreSection: {
    marginHorizontal: 20,
    marginTop: 28,
  },
  exploreSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 14,
  },
  exploreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  exploreCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: "47%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 8,
  },
  exploreIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  exploreCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exploreCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c3e50",
  },
  exploreCardDesc: {
    fontSize: 12,
    color: "#7f8c8d",
    lineHeight: 17,
  },

  welcomeCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
  },

  subtitle: {
    marginTop: 6,
    color: "#7f8c8d",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  notificationDot: {
    position: "absolute",
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },

  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: Platform.OS === "web" ? 90 : 100,
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  helpMenuCard: {
    backgroundColor: "white",
    borderRadius: 12,
    minWidth: 280,
    paddingVertical: 8,
    ...Platform.select({
      web: {},
      default: { elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 },
    }),
  },
  helpMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  helpMenuText: {
    fontSize: 15,
    color: "#2c3e50",
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
  },
  modalBody: {
    padding: 20,
  },
  modalParagraph: {
    fontSize: 15,
    color: "#2c3e50",
    lineHeight: 22,
  },
  modalNote: {
    fontSize: 14,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginBottom: 16,
  },
  iconGuideList: {
    gap: 12,
  },
  iconGuideRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconGuideLabel: {
    fontSize: 15,
    color: "#2c3e50",
  },
  iconGuideAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    color: "#2c3e50",
  },
  feedbackSubmitButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  feedbackSubmitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

});
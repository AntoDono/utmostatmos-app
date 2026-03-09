import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { leaderboardAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'
import colors from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'

const TROPHIES = ['🥇', '🥈', '🥉'];

const PodiumPlace = ({ user, place, height, isCurrentUser }) => {
  if (!user) return null;

  const podiumColors = {
    1: '#FFD700', // Gold
    2: '#C0C0C0', // Silver
    3: '#CD7F32', // Bronze
  };

  return (
    <View
      style={[
        styles.podiumPlace,
        { order: place === 1 ? 0 : place === 2 ? -1 : 1 },
        isCurrentUser && styles.currentUserHighlight,
      ]}
    >
      <Text style={styles.podiumTrophy}>{TROPHIES[place - 1]}</Text>
      <View style={styles.podiumUserInfo}>
        <Text style={styles.podiumName} numberOfLines={1}>
          {user.firstName} {user.lastName}
          {isCurrentUser ? ' (You)' : ''}
        </Text>
        <Text style={styles.podiumScore}>{user.leaderboardScore} pts</Text>
      </View>
      <View style={[styles.podiumBar, { height, backgroundColor: podiumColors[place] }]}>
        <Text style={styles.podiumNumber}>{place}</Text>
      </View>
    </View>
  );
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);
  const [myScore, setMyScore] = useState(null);
  const { user: authUser, accessToken } = useAuth();

  const currentAuth0Id = authUser?.sub || authUser?.user_id || null;
  const currentEmail = authUser?.email || null;

  const isCurrentUser = (entry) => {
    if (!entry) return false;
    if (currentAuth0Id && entry.auth0Id === currentAuth0Id) return true;
    if (currentEmail && entry.email === currentEmail) return true;
    return false;
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard(accessToken);
      if (!response.leaderboard) {
        throw new Error('Invalid response: missing leaderboard data');
      }
      setLeaderboard(response.leaderboard);
      if (response.currentUserRank != null) {
        setMyRank(response.currentUserRank);
      } else {
        setMyRank(null);
      }
      if (response.currentUser?.leaderboardScore != null) {
        setMyScore(response.currentUser.leaderboardScore);
      } else {
        setMyScore(null);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <View style={styles.container}>
      {leaderboard.length === 0 ? (
        <Text style={styles.emptyText}>No leaderboard data available</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {myRank != null && (
            <View style={styles.myRankCard}>
              <Text style={styles.myRankTitle}>Your rank</Text>
              <Text style={styles.myRankValue}>#{myRank}</Text>
              {myScore != null && (
                <Text style={styles.myRankScore}>{myScore} pts</Text>
              )}
            </View>
          )}
          {/* Podium Section */}
          <View style={styles.podiumContainer}>
            <View style={styles.podiumWrapper}>
              {/* 2nd Place - Left */}
              <PodiumPlace
                user={topThree[1]}
                place={2}
                height={100}
                isCurrentUser={isCurrentUser(topThree[1])}
              />
              {/* 1st Place - Center */}
              <PodiumPlace
                user={topThree[0]}
                place={1}
                height={130}
                isCurrentUser={isCurrentUser(topThree[0])}
              />
              {/* 3rd Place - Right */}
              <PodiumPlace
                user={topThree[2]}
                place={3}
                height={80}
                isCurrentUser={isCurrentUser(topThree[2])}
              />
            </View>
          </View>

          {/* Rest of Leaderboard */}
          {restOfLeaderboard.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Rankings</Text>
              {restOfLeaderboard.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.leaderboardItem,
                    isCurrentUser(item) && styles.currentUserHighlight,
                  ]}
                >
                  <View style={styles.rankBadge}>
                    <Text style={styles.rank}>{index + 4}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item.firstName} {item.lastName}
                      {isCurrentUser(item) ? ' (You)' : ''}
                    </Text>
                  </View>
                  <Text style={styles.score}>{item.leaderboardScore} pts</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  // Podium Styles
  podiumContainer: {
    marginBottom: 30,
    paddingVertical: 20,
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  podiumPlace: {
    alignItems: 'center',
    marginHorizontal: 8,
    flex: 1,
    maxWidth: 110,
  },
  podiumTrophy: {
    fontSize: 40,
    marginBottom: 8,
  },
  podiumUserInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  podiumNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // List Styles
  listContainer: {
    marginTop: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 15,
  },
  myRankCard: {
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    alignItems: 'center',
  },
  myRankTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  myRankValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  myRankScore: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserHighlight: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryMuted,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
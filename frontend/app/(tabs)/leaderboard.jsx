import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { leaderboardAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'
import colors from '../../constants/colors'

const TROPHIES = ['🥇', '🥈', '🥉'];

const PodiumPlace = ({ user, place, height }) => {
  if (!user) return null;
  
  const podiumColors = {
    1: '#FFD700', // Gold
    2: '#C0C0C0', // Silver
    3: '#CD7F32', // Bronze
  };

  return (
    <View style={[styles.podiumPlace, { order: place === 1 ? 0 : place === 2 ? -1 : 1 }]}>
      <Text style={styles.podiumTrophy}>{TROPHIES[place - 1]}</Text>
      <View style={styles.podiumUserInfo}>
        <Text style={styles.podiumName} numberOfLines={1}>
          {user.firstName}
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

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard();
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load leaderboard');
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
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.length === 0 ? (
        <Text style={styles.emptyText}>No leaderboard data available</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Podium Section */}
          <View style={styles.podiumContainer}>
            <View style={styles.podiumWrapper}>
              {/* 2nd Place - Left */}
              <PodiumPlace user={topThree[1]} place={2} height={100} />
              {/* 1st Place - Center */}
              <PodiumPlace user={topThree[0]} place={1} height={130} />
              {/* 3rd Place - Right */}
              <PodiumPlace user={topThree[2]} place={3} height={80} />
            </View>
          </View>

          {/* Rest of Leaderboard */}
          {restOfLeaderboard.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Rankings</Text>
              {restOfLeaderboard.map((item, index) => (
                <View key={item.id} style={styles.leaderboardItem}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rank}>{index + 4}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
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
    paddingTop: 60,
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
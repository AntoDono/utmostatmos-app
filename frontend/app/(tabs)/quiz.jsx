import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { quizAPI } from '../../utils/api'
import { Alert } from '../../components/Alert'

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizzes(10);
      setQuizzes(response.quizzes || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bin Quiz</Text>
      {quizzes.length === 0 ? (
        <Text style={styles.emptyText}>No quizzes available</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.quizItem}>
              <Text style={styles.quizQuestion}>Item: {item.item}</Text>
              <Text style={styles.quizAnswer}>Answer: {item.answer}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  quizItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  quizAnswer: {
    fontSize: 14,
    color: '#666',
  },
});
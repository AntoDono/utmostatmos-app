import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import { getScoreMessage } from '../../utils/quizHelpers';

const QuizResults = ({ score, totalQuestions, userAnswers, onPlayAgain }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.resultsTitle}>Quiz Complete! 🎉</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.finalScoreText}>Your Score</Text>
        <Text style={styles.finalScore}>{score} / {totalQuestions}</Text>
        <Text style={styles.percentageText}>
          {Math.round((score / totalQuestions) * 100)}%
        </Text>
        <Text style={styles.scoreMessage}>{getScoreMessage(score, totalQuestions)}</Text>
      </View>

      <Text style={styles.reviewTitle}>Review Your Answers:</Text>

      {userAnswers.map((answer, index) => (
        <View key={index} style={styles.answerCard}>
          <View style={styles.answerHeader}>
            <Text style={styles.questionNumberText}>Question {index + 1}</Text>
          </View>
          <Text style={styles.answerQuestion}>{answer.question}</Text>
          <View style={styles.answerDetails}>
            <Text style={styles.answerLabel}>Your answer: </Text>
            <Text style={[
              styles.answerValue,
              answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer
            ]}>
              {answer.userAnswer}
            </Text>
          </View>
          {!answer.isCorrect && (
            <View style={styles.answerDetails}>
              <Text style={styles.answerLabel}>Correct answer: </Text>
              <Text style={styles.correctAnswerValue}>{answer.correctAnswer}</Text>
            </View>
          )}
        </View>
      ))}

      <Pressable
        style={({ pressed }) => [
          styles.playAgainButton,
          pressed && styles.buttonPressed
        ]}
        onPress={onPlayAgain}
      >
        <Text style={styles.playAgainButtonText}>Play Again</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  finalScoreText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 15,
  },
  scoreMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  answerCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  answerQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  answerDetails: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  answerLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  correctAnswer: {
    color: colors.success,
  },
  incorrectAnswer: {
    color: colors.error,
  },
  correctAnswerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  playAgainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  playAgainButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});

export default QuizResults;

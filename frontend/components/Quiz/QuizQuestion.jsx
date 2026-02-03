import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import BinOption from './BinOption';

const QuizQuestion = ({ 
  quiz, 
  currentIndex, 
  totalQuestions, 
  score, 
  bins, 
  answered, 
  onAnswer, 
  onSkip, 
  onRestart,
  isGuest = false
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={styles.title}>School Supplies Game</Text>

      {/* Guest Warning Banner */}
      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>
            🔒 Login required to submit answers and track your score
          </Text>
        </View>
      )}

      {/* Score */}
      <Text style={styles.scoreText}>Score: {score}/{totalQuestions}</Text>
      <Text style={styles.questionNumber}>Question {currentIndex + 1} of {totalQuestions}</Text>

      {/* Question */}
      <Text style={styles.question}>
        Which bin does <Text style={styles.itemText}>{quiz.item}</Text> go into?
      </Text>

      {/* Item Image Placeholder */}
      <View style={styles.itemImageContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.placeholderText}>{quiz.item}</Text>
        </View>
      </View>

      {/* Bin Options */}
      <View style={styles.binsContainer}>
        {bins.map((bin) => (
          <BinOption
            key={bin.id}
            bin={bin}
            onPress={() => onAnswer(bin.label)}
            disabled={answered}
            isCorrect={answered && bin.label === quiz.answer}
          />
        ))}
      </View>

      {/* Skip Button */}
      <Pressable
        style={({ pressed }) => [
          styles.skipButton,
          pressed && styles.buttonPressed
        ]}
        onPress={onSkip}
        disabled={answered}
      >
        <Text style={[styles.skipButtonText, answered && styles.disabledText]}>
          Next Question
        </Text>
      </Pressable>

      {/* Restart Button */}
      <Pressable
        style={({ pressed }) => [
          styles.restartButton,
          pressed && styles.buttonPressed
        ]}
        onPress={onRestart}
      >
        <Text style={styles.restartButtonText}>Restart Quiz</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(109, 151, 115, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  guestBanner: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 0,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  guestBannerText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    color: colors.text,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  questionNumber: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 20,
    fontWeight: '500',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: colors.primary,
  },
  itemImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  itemImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: colors.backgroundDark,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  binsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    gap: 15,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: colors.primaryMuted,
  },
  skipButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: colors.buttonDisabled,
  },
  restartButton: {
    alignSelf: 'center',
    backgroundColor: colors.backgroundDark,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  restartButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});

export default QuizQuestion;

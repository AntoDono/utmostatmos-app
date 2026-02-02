import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Pressable, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import colors from '../../constants/colors'

// Interactive Bin Option Component
const BinOption = ({ bin, onPress, disabled, isCorrect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.binOption}
    >
      <Animated.View
        style={[
          styles.binContainer,
          { transform: [{ scale: scaleAnim }] },
          isCorrect && styles.correctBinContainer,
        ]}
      >
        <Image
          source={bin.image}
          style={styles.binImage}
          resizeMode="contain"
        />
        <Text style={styles.binLabel}>{bin.label}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default function Quiz() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Quiz data
  const quizzes = [
    { id: 1, item: 'Plastic Water Bottle', answer: 'Recycle' },
    { id: 2, item: 'Banana Peel', answer: 'Compost' },
    { id: 3, item: 'Paper Napkin', answer: 'Waste' },
    { id: 4, item: 'Cardboard Box', answer: 'Recycle' },
    { id: 5, item: 'Apple Core', answer: 'Compost' },
    { id: 6, item: 'Plastic Bag', answer: 'Waste' },
    { id: 7, item: 'Glass Bottle', answer: 'Recycle' },
    { id: 8, item: 'Coffee Grounds', answer: 'Compost' },
    { id: 9, item: 'Aluminum Can', answer: 'Recycle' },
    { id: 10, item: 'Pizza Box (Greasy)', answer: 'Waste' }
  ];

  const bins = [
    { id: 'waste', label: 'Waste', image: require('../../assets/images/waste.png') },
    { id: 'recycle', label: 'Recycle', image: require('../../assets/images/recycle.png') },
    { id: 'compost', label: 'Compost', image: require('../../assets/images/compost.png') }
  ];

  const handleAnswer = (selectedBin) => {
    if (answered) return; // Prevent multiple answers

    const currentQuiz = quizzes[currentQuizIndex];
    const isCorrect = selectedBin.toLowerCase() === currentQuiz.answer.toLowerCase();

    setAnswered(true);

    // Store the answer
    const newAnswer = {
      question: currentQuiz.item,
      correctAnswer: currentQuiz.answer,
      userAnswer: selectedBin,
      isCorrect: isCorrect
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    
    // Update score if correct
    if (isCorrect) {
      setScore(score + 1);
    }

    // Auto-advance after 1 second
    setTimeout(() => {
      if (currentQuizIndex === quizzes.length - 1) {
        // Last question - go to results
        setShowResults(true);
      } else {
        // Not last question - move to next
        moveToNext();
      }
    }, 1000);
  };

  const moveToNext = () => {
    setCurrentQuizIndex(currentQuizIndex + 1);
    setAnswered(false);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setAnswered(false);
    setShowResults(false);
    setUserAnswers([]);
  };

  const skipQuestion = () => {
    // Just move to next question without recording anything
    // Check if this is the last question
    if (currentQuizIndex === quizzes.length - 1) {
      // Last question - go to results
      setShowResults(true);
    } else {
      // Not last question - move to next
      setCurrentQuizIndex(currentQuizIndex + 1);
      setAnswered(false);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / quizzes.length) * 100;
    if (percentage === 100) return "Perfect! You're a waste sorting expert! 🌟";
    if (percentage >= 80) return "Excellent work! You know your bins! 🎉";
    if (percentage >= 60) return "Good job! Keep learning! 👍";
    if (percentage >= 40) return "Not bad! Practice makes perfect! 💪";
    return "Keep trying! You'll get better! 📚";
  };

  const currentQuiz = quizzes[currentQuizIndex];

  // Results Page
  if (showResults) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.resultsTitle}>Quiz Complete! 🎉</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.finalScoreText}>Your Score</Text>
          <Text style={styles.finalScore}>{score} / {quizzes.length}</Text>
          <Text style={styles.percentageText}>
            {Math.round((score / quizzes.length) * 100)}%
          </Text>
          <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
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
          onPress={resetQuiz}
        >
          <Text style={styles.playAgainButtonText}>Play Again</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Quiz Page
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={styles.title}>School Supplies Game</Text>

      {/* Score */}
      <Text style={styles.scoreText}>Score: {score}/{quizzes.length}</Text>
      <Text style={styles.questionNumber}>Question {currentQuizIndex + 1} of {quizzes.length}</Text>

      {/* Question */}
      <Text style={styles.question}>
        Which bin does <Text style={styles.itemText}>{currentQuiz.item}</Text> go into?
      </Text>

      {/* Item Image Placeholder */}
      <View style={styles.itemImageContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.placeholderText}>{currentQuiz.item}</Text>
        </View>
      </View>

      {/* Bin Options */}
      <View style={styles.binsContainer}>
        {bins.map((bin) => (
          <BinOption
            key={bin.id}
            bin={bin}
            onPress={() => handleAnswer(bin.label)}
            disabled={answered}
            isCorrect={answered && bin.label === currentQuiz.answer}
          />
        ))}
      </View>

      {/* Skip Button */}
      <Pressable
        style={({ pressed }) => [
          styles.skipButton,
          pressed && styles.buttonPressed
        ]}
        onPress={skipQuestion}
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
        onPress={resetQuiz}
      >
        <Text style={styles.restartButtonText}>Restart Quiz</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
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
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    gap: 20,
  },
  binOption: {
    
  },
  binContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  correctBinContainer: {
    borderWidth: 3,
    borderColor: colors.success,
    backgroundColor: colors.successLight,
    shadowColor: colors.success,
    shadowOpacity: 0.3,
  },
  binImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  binLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
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
  // Results Page Styles
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
  correctBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
  },
  incorrectBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error,
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
});
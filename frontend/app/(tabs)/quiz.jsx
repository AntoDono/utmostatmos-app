import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

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
    { id: 'waste', label: 'Waste' },
    { id: 'recycle', label: 'Recycle' },
    { id: 'compost', label: 'Compost' }
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

    // Auto-advance after 2 seconds
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

        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={resetQuiz}
        >
          <Text style={styles.playAgainButtonText}>Play Again</Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            key={bin.id}
            style={styles.binOption}
            onPress={() => handleAnswer(bin.label)}
            disabled={answered}
          >
            <View style={[
              styles.binImagePlaceholder,
              answered && bin.label === currentQuiz.answer && styles.correctBin
            ]} />
            <Text style={styles.binLabel}>{bin.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={skipQuestion}
        disabled={answered}
      >
        <Text style={[styles.skipButtonText, answered && styles.disabledText]}>
          Next Question
        </Text>
      </TouchableOpacity>

      {/* Restart Button */}
      <TouchableOpacity
        style={styles.restartButton}
        onPress={resetQuiz}
      >
        <Text style={styles.restartButtonText}>Restart Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  questionNumber: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
    paddingHorizontal: 10,
  },
  itemText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  itemImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  itemImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#d3d3d3',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  binsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    gap: 15,
  },
  binOption: {
    alignItems: 'center',
    width: 80,
  },
  binImagePlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    marginBottom: 8,
  },
  correctBin: {
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  binLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  disabledText: {
    color: '#999',
  },
  restartButton: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  restartButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  // Results Page Styles
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  finalScoreText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 15,
  },
  scoreMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  answerCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#666',
  },
  correctBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  incorrectBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f44336',
  },
  answerQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  answerDetails: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  answerLabel: {
    fontSize: 14,
    color: '#666',
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  correctAnswer: {
    color: '#4CAF50',
  },
  incorrectAnswer: {
    color: '#f44336',
  },
  correctAnswerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  playAgainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
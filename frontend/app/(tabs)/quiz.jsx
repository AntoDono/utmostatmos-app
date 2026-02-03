import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { quizAPI } from '../../utils/api';
import { transformQuizzes, getBinsForQuiz } from '../../utils/quizHelpers';
import QuizQuestion from '../../components/Quiz/QuizQuestion';
import QuizResults from '../../components/Quiz/QuizResults';
import { LoadingState, ErrorState, EmptyState } from '../../components/Quiz/LoadingState';

export default function Quiz() {
  const { getAccessToken, isAuthenticated, login } = useAuth();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quizzes from backend on mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizAPI.getQuizzes(10);
      
      if (response.quizzes && response.quizzes.length > 0) {
        setQuizzes(transformQuizzes(response.quizzes));
      } else {
        setError('No quizzes available');
      }
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedBin) => {
    if (answered) return; // Prevent multiple answers

    // Check if user is authenticated before allowing answer
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to submit quiz answers and track your score.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: async () => {
              try {
                await login();
              } catch (error) {
                console.error('Login error:', error);
              }
            }
          }
        ]
      );
      return;
    }

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
      
      // Submit score to backend only if user is authenticated
      const accessToken = await getAccessToken();
      await quizAPI.submitAnswer(accessToken, 10); // 10 points per correct answer
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
    // Refetch quizzes to get new questions
    fetchQuizzes();
  };

  const skipQuestion = () => {
    // Just move to next question without recording anything
    if (currentQuizIndex === quizzes.length - 1) {
      // Last question - go to results
      setShowResults(true);
    } else {
      // Not last question - move to next
      setCurrentQuizIndex(currentQuizIndex + 1);
      setAnswered(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={fetchQuizzes} />;
  }

  // No quizzes available
  if (quizzes.length === 0) {
    return <EmptyState />;
  }

  const currentQuiz = quizzes[currentQuizIndex];

  // Results Page
  if (showResults) {
    return (
      <QuizResults
        score={score}
        totalQuestions={quizzes.length}
        userAnswers={userAnswers}
        onPlayAgain={resetQuiz}
      />
    );
  }

  // Quiz Page
  return (
    <QuizQuestion
      quiz={currentQuiz}
      currentIndex={currentQuizIndex}
      totalQuestions={quizzes.length}
      score={score}
      bins={getBinsForQuiz(currentQuiz)}
      answered={answered}
      onAnswer={handleAnswer}
      onSkip={skipQuestion}
      onRestart={resetQuiz}
      isGuest={!isAuthenticated}
    />
  );
}

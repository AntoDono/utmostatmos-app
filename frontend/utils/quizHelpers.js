// Map bin types to images
export const getBinImage = (binType) => {
  const lowerBinType = binType.toLowerCase();
  if (lowerBinType.includes('recycle') || lowerBinType.includes('recycling')) {
    return require('../assets/images/recycle.png');
  } else if (lowerBinType.includes('compost')) {
    return require('../assets/images/compost.png');
  } else {
    // Default to waste for Trash, Hazardous Waste, Donate, etc.
    return require('../assets/images/waste.png');
  }
};

// Get score message based on percentage
export const getScoreMessage = (score, totalQuestions) => {
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) return "Perfect! You're a waste sorting expert! 🌟";
  if (percentage >= 80) return "Excellent work! You know your bins! 🎉";
  if (percentage >= 60) return "Good job! Keep learning! 👍";
  if (percentage >= 40) return "Not bad! Practice makes perfect! 💪";
  return "Keep trying! You'll get better! 📚";
};

// Transform backend quiz format to match component format
export const transformQuizzes = (quizzes) => {
  return quizzes.map(quiz => ({
    id: quiz.id,
    item: quiz.item,
    answer: quiz.answer,
    choices: quiz.choices
  }));
};

// Get current quiz choices as bins
export const getBinsForQuiz = (quiz) => {
  if (!quiz || !quiz.choices) return [];
  return quiz.choices.map(choice => ({
    id: choice.toLowerCase().replace(/\s+/g, '-'),
    label: choice,
    image: getBinImage(choice)
  }));
};

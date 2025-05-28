// Function to shuffle an array (for randomizing question order or answer choices)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to check if an answer is correct for different question types
export function checkAnswer(question, userAnswer) {
  switch (question.type) {
    case 'multiple-choice':
      return userAnswer === question.answer;
    
    case 'true-false':
      return userAnswer === question.answer;
    
    case 'fill-in-the-blank':
      if (!userAnswer) return false;
      
      // Convert both to lowercase for case-insensitive comparison
      const normalizedUserAnswer = userAnswer.toLowerCase().trim();
      
      // Check if the user's answer matches any of the accepted answers
      if (Array.isArray(question.answer)) {
        return question.answer.some(answer => 
          normalizedUserAnswer === answer.toLowerCase().trim()
        );
      } else {
        return normalizedUserAnswer === question.answer.toLowerCase().trim();
      }
    
    case 'matching':
      if (!userAnswer || typeof userAnswer !== 'object') return false;
      
      // For matching questions, userAnswer should be an object with keys matching the items
      // and values matching the correct descriptions
      if (question.pairs) {
        // New format with pairs array
        for (const pair of question.pairs) {
          if (userAnswer[pair.item] !== pair.description) {
            return false;
          }
        }
        return true;
      } else if (question.stems && question.options) {
        // Old format with stems and options
        for (const stem in question.stems) {
          if (userAnswer[stem] !== question.answer[stem]) {
            return false;
          }
        }
        return true;
      } else if (question.options) {
        // Another format with options object
        for (const item in question.options) {
          if (userAnswer[item] !== question.answers[item]) {
            return false;
          }
        }
        return true;
      }
      return false;
    
    case 'select all that apply':
      if (!userAnswer || !Array.isArray(userAnswer)) return false;
      
      // For "select all that apply", both arrays should have the same elements
      if (Array.isArray(question.answer)) {
        if (userAnswer.length !== question.answer.length) return false;
        
        // Check if all selected options are correct
        return userAnswer.every(option => question.answer.includes(option));
      } else {
        return false;
      }
    
    case 'short-answer':
    case 'critical-thinking':
      // These are typically manually graded, but we can implement a simple check
      // For now, just check if the user provided an answer
      return userAnswer && userAnswer.trim().length > 0;
    
    default:
      return false;
  }
}

// Function to get feedback for a question
export function getFeedback(question, isCorrect, userAnswer) {
  if (isCorrect) {
    return {
      message: "Correct!",
      explanation: question.explanation || "Great job!"
    };
  } else {
    let message = "Incorrect.";
    
    // For multiple choice, show the correct answer
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      message += ` The correct answer is: ${question.answer}`;
    }
    // For fill-in-the-blank, show the accepted answers
    else if (question.type === 'fill-in-the-blank') {
      const answers = Array.isArray(question.answer) 
        ? question.answer.join(' or ') 
        : question.answer;
      message += ` Acceptable answer(s): ${answers}`;
    }
    // For matching, it's complex to show all correct matches in a simple message
    // For select all, show the correct options
    else if (question.type === 'select all that apply') {
      message += ` The correct options are: ${question.answer.join(', ')}`;
    }
    
    return {
      message,
      explanation: question.explanation || "Review the material and try again."
    };
  }
}
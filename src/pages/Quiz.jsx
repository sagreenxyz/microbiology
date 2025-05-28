import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'

function Quiz() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chapterTitle, setChapterTitle] = useState('')
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/microbiology-chapter-${chapterId.padStart(2, '0')}.json`)
        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }
        const data = await response.json()
        setChapterTitle(data.title)
        setQuestions(data.questions)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Failed to load questions. Please try again later.')
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [chapterId])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))

    // Update score for multiple choice and true/false questions
    const question = questions.find(q => q.id === questionId)
    if (question && (question.type === 'multiple-choice' || question.type === 'true-false')) {
      const isCorrect = Array.isArray(question.answer) 
        ? question.answer.includes(answer)
        : question.answer === answer
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate results
      const results = {
        chapterId,
        chapterTitle,
        totalQuestions: questions.length,
        score,
        answers: Object.entries(answers).map(([questionId, userAnswer]) => {
          const question = questions.find(q => q.id.toString() === questionId)
          const isCorrect = Array.isArray(question.answer) 
            ? question.answer.includes(userAnswer)
            : question.answer === userAnswer
          
          return {
            questionId,
            question: question.text,
            userAnswer,
            correctAnswer: question.answer,
            isCorrect,
            explanation: question.explanation
          }
        })
      }
      
      // Store results in session storage
      sessionStorage.setItem('quizResults', JSON.stringify(results))
      
      // Navigate to results page
      navigate('/results')
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <div className="text-yellow-600 mb-4">No questions found for this chapter.</div>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  
  // Calculate how many multiple choice and true/false questions we have
  const scorableQuestions = questions.filter(q => 
    q.type === 'multiple-choice' || q.type === 'true-false'
  ).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">{chapterTitle}</h1>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-medium text-gray-800">
            Score: {score}/{scorableQuestions}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <QuestionCard 
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id]}
        onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default Quiz
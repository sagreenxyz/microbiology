import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Results() {
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      navigate('/')
    }
  }, [navigate])

  if (!results) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const correctAnswers = results.answers.filter(a => a.isCorrect).length
  const score = Math.round((correctAnswers / results.totalQuestions) * 100)
  
  let feedback
  if (score >= 90) {
    feedback = "Excellent! You have a strong understanding of this chapter."
  } else if (score >= 70) {
    feedback = "Good job! You have a solid grasp of the material."
  } else if (score >= 50) {
    feedback = "You're on the right track, but might need to review some concepts."
  } else {
    feedback = "You should consider reviewing this chapter more thoroughly."
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
        <p className="text-xl">{results.chapterTitle}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{score}%</h2>
            <p className="text-gray-600">
              {correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="w-full md:w-64 bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
                  score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">{feedback}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-4">Question Review</h3>
          <div className="space-y-6">
            {results.answers.map((answer, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="font-medium mb-2">
                  {index + 1}. {answer.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-600">Your answer:</p>
                    <p className={`font-medium ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.userAnswer || 'No answer provided'}
                    </p>
                  </div>
                  {!answer.isCorrect && (
                    <div>
                      <p className="text-sm text-gray-600">Correct answer:</p>
                      <p className="font-medium text-green-600">
                        {Array.isArray(answer.correctAnswer) 
                          ? answer.correctAnswer.join(' or ') 
                          : answer.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p>{answer.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(`/quiz/${results.chapterId}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Retry Chapter
        </button>
      </div>
    </div>
  )
}

export default Results
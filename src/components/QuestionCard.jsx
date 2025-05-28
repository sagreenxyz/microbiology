import { useState, useEffect } from 'react'

function QuestionCard({ question, selectedAnswer, onAnswer }) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Automatically show explanation when an answer is selected
  useEffect(() => {
    if (selectedAnswer) {
      setShowExplanation(true)
    }
  }, [selectedAnswer])

  const handleAnswerSelect = (answer) => {
    onAnswer(answer)
    setSubmitted(true)
  }

  const isCorrect = (option) => {
    if (!submitted) return false
    
    if (Array.isArray(question.answer)) {
      return question.answer.includes(option)
    }
    return option === question.answer
  }

  const isIncorrect = (option) => {
    if (!submitted) return false
    return selectedAnswer === option && !isCorrect(option)
  }

  const renderMultipleChoice = () => {
    const options = Array.isArray(question.options) 
      ? question.options 
      : Object.values(question.options)

    return (
      <div className="space-y-3">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              isCorrect(option)
                ? 'bg-green-100 border-green-500 text-green-800'
                : isIncorrect(option)
                ? 'bg-red-100 border-red-500 text-red-800'
                : selectedAnswer === option
                ? 'bg-blue-100 border-blue-500 text-blue-800'
                : 'hover:bg-gray-100 border-gray-300 text-gray-800'
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
            {submitted && isCorrect(option) && (
              <span className="ml-2 text-green-700">✓</span>
            )}
            {submitted && isIncorrect(option) && (
              <span className="ml-2 text-red-700">✗</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderFillInTheBlank = () => {
    return (
      <div>
        <input
          type="text"
          value={selectedAnswer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
            submitted && isCorrect(selectedAnswer)
              ? 'border-green-500 bg-green-50'
              : submitted
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
        />
        <div className="mt-2 flex justify-between items-center">
          <button 
            onClick={() => {
              setShowExplanation(true)
              setSubmitted(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
          
          {submitted && (
            <div className="text-right">
              {isCorrect(selectedAnswer) ? (
                <span className="text-green-700 font-medium">Correct!</span>
              ) : (
                <div>
                  <span className="text-red-700 font-medium">Incorrect</span>
                  <p className="text-gray-800 mt-1">
                    Correct answer: {Array.isArray(question.answer) 
                      ? question.answer.join(' or ') 
                      : question.answer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderTrueFalse = () => {
    return (
      <div className="space-y-3">
        <div 
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            isCorrect('true')
              ? 'bg-green-100 border-green-500 text-green-800'
              : isIncorrect('true')
              ? 'bg-red-100 border-red-500 text-red-800'
              : selectedAnswer === 'true'
              ? 'bg-blue-100 border-blue-500 text-blue-800'
              : 'hover:bg-gray-100 border-gray-300 text-gray-800'
          }`}
          onClick={() => handleAnswerSelect('true')}
        >
          True
          {submitted && isCorrect('true') && (
            <span className="ml-2 text-green-700">✓</span>
          )}
          {submitted && isIncorrect('true') && (
            <span className="ml-2 text-red-700">✗</span>
          )}
        </div>
        <div 
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            isCorrect('false')
              ? 'bg-green-100 border-green-500 text-green-800'
              : isIncorrect('false')
              ? 'bg-red-100 border-red-500 text-red-800'
              : selectedAnswer === 'false'
              ? 'bg-blue-100 border-blue-500 text-blue-800'
              : 'hover:bg-gray-100 border-gray-300 text-gray-800'
          }`}
          onClick={() => handleAnswerSelect('false')}
        >
          False
          {submitted && isCorrect('false') && (
            <span className="ml-2 text-green-700">✓</span>
          )}
          {submitted && isIncorrect('false') && (
            <span className="ml-2 text-red-700">✗</span>
          )}
        </div>
      </div>
    )
  }

  const renderShortAnswer = () => {
    return (
      <div>
        <textarea
          value={selectedAnswer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          rows={4}
        />
        <div className="mt-2 flex justify-between items-center">
          <button 
            onClick={() => {
              setShowExplanation(true)
              setSubmitted(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
          
          {submitted && (
            <div className="text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="font-medium">Model Answer:</p>
              <p>{question.answer}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCriticalThinking = () => {
    return (
      <div>
        <textarea
          value={selectedAnswer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          rows={6}
        />
        <div className="mt-2 flex justify-between items-center">
          <button 
            onClick={() => {
              setShowExplanation(true)
              setSubmitted(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
          
          {submitted && (
            <div className="text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-200">
              <p className="font-medium">Model Answer:</p>
              <p>{question.answer}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMatching = () => {
    const items = question.pairs || []
    const [matchings, setMatchings] = useState({})

    const handleMatch = (item, description) => {
      const newMatchings = { ...matchings, [item]: description }
      setMatchings(newMatchings)
      onAnswer(newMatchings)
    }

    const allMatched = items.every(pair => matchings[pair.item])
    const isItemCorrect = (item) => {
      if (!submitted || !matchings[item]) return false
      
      const correctMatch = items.find(pair => pair.item === item)?.description
      return matchings[item] === correctMatch
    }

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Items</h3>
            {items.map((pair, index) => (
              <div 
                key={index} 
                className={`p-2 border rounded ${
                  submitted && isItemCorrect(pair.item)
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : submitted && matchings[pair.item]
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                {pair.item}
                {submitted && isItemCorrect(pair.item) && (
                  <span className="ml-2 text-green-700">✓</span>
                )}
                {submitted && matchings[pair.item] && !isItemCorrect(pair.item) && (
                  <span className="ml-2 text-red-700">✗</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Descriptions</h3>
            {items.map((pair, index) => (
              <select 
                key={index}
                value={matchings[pair.item] || ''}
                onChange={(e) => handleMatch(pair.item, e.target.value)}
                className={`w-full p-2 border rounded text-gray-800 bg-white ${
                  submitted && isItemCorrect(pair.item)
                    ? 'border-green-500'
                    : submitted && matchings[pair.item]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                disabled={submitted}
              >
                <option value="">-- Select match --</option>
                {items.map((p, i) => (
                  <option key={i} value={p.description}>
                    {p.description}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
        
        {!showExplanation && allMatched && (
          <button 
            onClick={() => {
              setShowExplanation(true)
              setSubmitted(true)
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Answers
          </button>
        )}
        
        {submitted && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-gray-800">Correct Matches:</h4>
            <ul className="mt-2 space-y-1">
              {items.map((pair, index) => (
                <li key={index} className="text-gray-800">
                  <span className="font-medium">{pair.item}</span> → {pair.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice()
      case 'fill-in-the-blank':
        return renderFillInTheBlank()
      case 'true-false':
        return renderTrueFalse()
      case 'short-answer':
        return renderShortAnswer()
      case 'critical-thinking':
        return renderCriticalThinking()
      case 'matching':
        return renderMatching()
      default:
        return renderMultipleChoice()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="mb-2 text-sm font-medium text-gray-600">
        {question.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </div>
      
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{question.text}</h2>
      
      {question.imageUrl && (
        <div className="mb-4">
          <img 
            src={question.imageUrl} 
            alt="Question illustration" 
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div className="mb-6">
        {renderQuestionContent()}
      </div>
      
      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
          <p className="text-gray-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
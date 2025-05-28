import { useState, useEffect } from 'react'

function QuestionCard({ question, selectedAnswer, onAnswer }) {
  const [showExplanation, setShowExplanation] = useState(false)

  // Automatically show explanation when an answer is selected
  useEffect(() => {
    if (selectedAnswer) {
      setShowExplanation(true)
    }
  }, [selectedAnswer])

  const handleAnswerSelect = (answer) => {
    onAnswer(answer)
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
              selectedAnswer === option
                ? 'bg-blue-200 border-blue-600 text-blue-900'
                : 'hover:bg-gray-100 border-gray-300 text-gray-800'
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
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
          onChange={(e) => handleAnswerSelect(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <button 
          onClick={() => setShowExplanation(true)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
      </div>
    )
  }

  const renderTrueFalse = () => {
    return (
      <div className="space-y-3">
        <div 
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedAnswer === 'true'
              ? 'bg-blue-200 border-blue-600 text-blue-900'
              : 'hover:bg-gray-100 border-gray-300 text-gray-800'
          }`}
          onClick={() => handleAnswerSelect('true')}
        >
          True
        </div>
        <div 
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedAnswer === 'false'
              ? 'bg-blue-200 border-blue-600 text-blue-900'
              : 'hover:bg-gray-100 border-gray-300 text-gray-800'
          }`}
          onClick={() => handleAnswerSelect('false')}
        >
          False
        </div>
      </div>
    )
  }

  const renderShortAnswer = () => {
    return (
      <div>
        <textarea
          value={selectedAnswer || ''}
          onChange={(e) => handleAnswerSelect(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          rows={4}
        />
        <button 
          onClick={() => setShowExplanation(true)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
      </div>
    )
  }

  const renderCriticalThinking = () => {
    return (
      <div>
        <textarea
          value={selectedAnswer || ''}
          onChange={(e) => handleAnswerSelect(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          rows={6}
        />
        <button 
          onClick={() => setShowExplanation(true)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
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

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Items</h3>
            {items.map((pair, index) => (
              <div key={index} className="p-2 border rounded bg-gray-50 text-gray-800">
                {pair.item}
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
                className="w-full p-2 border rounded text-gray-800 bg-white"
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
            onClick={() => setShowExplanation(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Answers
          </button>
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
      
      {selectedAnswer && showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
          <p className="text-gray-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
import { useState } from 'react'

function QuestionCard({ question, selectedAnswer, onAnswer }) {
  const [showExplanation, setShowExplanation] = useState(false)

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

    return (
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
      
      {selectedAnswer && (
        <div className="mt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-blue-700 hover:text-blue-900 text-sm font-medium"
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </button>
          
          {showExplanation && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-800">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
import { useState, useEffect } from 'react'
import { 
  Typography, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Checkbox, 
  FormGroup,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  Divider
} from '@mui/material'
import { checkAnswer, getFeedback } from '../utils/questionUtils'

function QuestionRenderer({ 
  question, 
  questionNumber, 
  onAnswer, 
  showFeedback = true,
  savedAnswer = null,
  savedResult = null
}) {
  const [answer, setAnswer] = useState(savedAnswer || '')
  const [submitted, setSubmitted] = useState(savedResult !== null)
  const [isCorrect, setIsCorrect] = useState(savedResult)
  const [feedback, setFeedback] = useState(null)
  const [matchingAnswers, setMatchingAnswers] = useState({})

  useEffect(() => {
    // Reset state when question changes
    if (!savedAnswer) {
      setAnswer('')
      setMatchingAnswers({})
    } else if (question.type === 'select all that apply' && Array.isArray(savedAnswer)) {
      setAnswer(savedAnswer)
    } else if (question.type === 'matching' && typeof savedAnswer === 'object') {
      setMatchingAnswers(savedAnswer)
    } else {
      setAnswer(savedAnswer)
    }
    
    setSubmitted(savedResult !== null)
    setIsCorrect(savedResult)
    setFeedback(null)
  }, [question, savedAnswer, savedResult])

  const handleSubmit = () => {
    let finalAnswer = answer
    
    // For matching questions, use the matchingAnswers object
    if (question.type === 'matching') {
      finalAnswer = matchingAnswers
    }
    
    const correct = checkAnswer(question, finalAnswer)
    setIsCorrect(correct)
    setSubmitted(true)
    setFeedback(getFeedback(question, correct, finalAnswer))
    
    // Call the onAnswer callback with the result
    onAnswer(finalAnswer, correct)
  }

  const handleMatchingChange = (item, value) => {
    setMatchingAnswers(prev => ({
      ...prev,
      [item]: value
    }))
  }

  const handleCheckboxChange = (option) => {
    setAnswer(prev => {
      if (Array.isArray(prev)) {
        if (prev.includes(option)) {
          return prev.filter(item => item !== option)
        } else {
          return [...prev, option]
        }
      } else {
        return [option]
      }
    })
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={submitted}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )
      
      case 'true-false':
        return (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="True"
                disabled={submitted}
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
                disabled={submitted}
              />
            </RadioGroup>
          </FormControl>
        )
      
      case 'fill-in-the-blank':
        return (
          <TextField
            fullWidth
            label="Your Answer"
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            margin="normal"
          />
        )
      
      case 'matching':
        // Determine the format of the matching question
        let items = []
        let options = []
        
        if (question.pairs) {
          // New format with pairs array
          items = question.pairs.map(pair => pair.item)
          options = question.pairs.map(pair => pair.description)
        } else if (question.stems && question.options) {
          // Old format with stems and options
          items = Object.keys(question.stems)
          options = Object.values(question.options)
        } else if (question.options) {
          // Another format with options object
          items = Object.keys(question.options)
          options = Object.values(question.options)
        }
        
        return (
          <Box>
            {items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {item}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Match with</InputLabel>
                  <Select
                    value={matchingAnswers[item] || ''}
                    onChange={(e) => handleMatchingChange(item, e.target.value)}
                    disabled={submitted}
                    label="Match with"
                  >
                    <MenuItem value="">
                      <em>Select an option</em>
                    </MenuItem>
                    {options.map((option, optIndex) => (
                      <MenuItem key={optIndex} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Box>
        )
      
      case 'select all that apply':
        return (
          <FormGroup>
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={Array.isArray(answer) && answer.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    disabled={submitted}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        )
      
      case 'short-answer':
      case 'critical-thinking':
        return (
          <TextField
            fullWidth
            label="Your Answer"
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            margin="normal"
            multiline
            rows={4}
          />
        )
      
      default:
        return (
          <Typography variant="body1" color="error">
            Unsupported question type: {question.type}
          </Typography>
        )
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Question {questionNumber}
      </Typography>
      
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {question.text}
      </Typography>
      
      {question.imageUrl && (
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <img 
            src={question.imageUrl} 
            alt="Question illustration" 
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </Box>
      )}
      
      {renderQuestionContent()}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        {!submitted ? (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={
              answer === '' || 
              (question.type === 'select all that apply' && (!Array.isArray(answer) || answer.length === 0)) ||
              (question.type === 'matching' && Object.keys(matchingAnswers).length < (question.pairs?.length || Object.keys(question.stems || {}).length || Object.keys(question.options || {}).length))
            }
          >
            Submit
          </Button>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: isCorrect ? 'success.main' : 'error.main' }}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Typography>
        )}
      </Box>
      
      {submitted && showFeedback && feedback && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Alert severity={isCorrect ? "success" : "error"}>
            {feedback.message}
          </Alert>
          {feedback.explanation && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Explanation:</strong> {feedback.explanation}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  )
}

export default QuestionRenderer
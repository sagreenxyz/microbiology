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
  Divider,
  Card,
  CardContent,
  CardActions
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
  const [showExplanation, setShowExplanation] = useState(false)

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
    setShowExplanation(false)
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

  const getRadioColor = (option) => {
    if (!submitted || !showFeedback) return 'primary';
    
    if (question.answer === option) {
      return 'success'; // Correct answer is always green
    } else if (answer === option) {
      return 'error'; // User's incorrect selection is red
    }
    
    return 'primary'; // Other options remain default
  }

  const getCheckboxColor = (option) => {
    if (!submitted || !showFeedback) return 'primary';
    
    if (Array.isArray(question.answer) && question.answer.includes(option)) {
      return 'success'; // Correct answer is always green
    } else if (Array.isArray(answer) && answer.includes(option) && 
              (!Array.isArray(question.answer) || !question.answer.includes(option))) {
      return 'error'; // User's incorrect selection is red
    }
    
    return 'primary'; // Other options remain default
  }

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  }

  const renderQuestionContent = () => {
    // For short answer, critical thinking, and fill-in-the-blank questions, render as flashcards
    if (question.type === 'short-answer' || question.type === 'critical-thinking' || question.type === 'fill-in-the-blank') {
      return (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
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
            
            {!submitted ? (
              <TextField
                fullWidth
                label="Your Answer"
                variant="outlined"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                multiline
                rows={question.type === 'fill-in-the-blank' ? 1 : 4}
                margin="normal"
              />
            ) : (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Your Answer:
                </Typography>
                <Typography variant="body1" paragraph sx={{ pl: 2 }}>
                  {answer}
                </Typography>
                
                {showExplanation && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {question.type === 'fill-in-the-blank' ? "Correct Answer:" : "Model Answer:"}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ pl: 2 }}>
                      {Array.isArray(question.answer) ? question.answer[0] : question.answer}
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Explanation:
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ pl: 2 }}>
                      {question.explanation}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </CardContent>
          <CardActions>
            {submitted && (
              <Button 
                size="small" 
                onClick={toggleExplanation}
                color="primary"
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
            )}
          </CardActions>
        </Card>
      )
    }

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
                  control={
                    <Radio 
                      color={getRadioColor(option)}
                      sx={{
                        '&.Mui-checked': {
                          color: submitted && showFeedback ? 
                            (question.answer === option ? 'success.main' : 
                             answer === option ? 'error.main' : undefined) : 
                            undefined
                        }
                      }}
                    />
                  }
                  label={option}
                  disabled={submitted}
                  sx={{
                    ...(submitted && showFeedback && question.answer === option && {
                      backgroundColor: 'rgba(76, 175, 80, 0.1)', // Light green background for correct answer
                      borderRadius: 1,
                      px: 1
                    })
                  }}
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
                control={
                  <Radio 
                    color={getRadioColor('true')}
                    sx={{
                      '&.Mui-checked': {
                        color: submitted && showFeedback ? 
                          (question.answer === 'true' ? 'success.main' : 
                           answer === 'true' ? 'error.main' : undefined) : 
                          undefined
                      }
                    }}
                  />
                }
                label="True"
                disabled={submitted}
                sx={{
                  ...(submitted && showFeedback && question.answer === 'true' && {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 1,
                    px: 1
                  })
                }}
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio 
                    color={getRadioColor('false')}
                    sx={{
                      '&.Mui-checked': {
                        color: submitted && showFeedback ? 
                          (question.answer === 'false' ? 'success.main' : 
                           answer === 'false' ? 'error.main' : undefined) : 
                          undefined
                      }
                    }}
                  />
                }
                label="False"
                disabled={submitted}
                sx={{
                  ...(submitted && showFeedback && question.answer === 'false' && {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 1,
                    px: 1
                  })
                }}
              />
            </RadioGroup>
          </FormControl>
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
                    error={submitted && showFeedback && 
                      (question.pairs ? 
                        matchingAnswers[item] !== question.pairs.find(p => p.item === item)?.description :
                        question.answers && matchingAnswers[item] !== question.answers[item])}
                    color={submitted && showFeedback && 
                      (question.pairs ? 
                        matchingAnswers[item] === question.pairs.find(p => p.item === item)?.description :
                        question.answers && matchingAnswers[item] === question.answers[item]) ? 'success' : undefined}
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
                
                {submitted && showFeedback && (
                  <Box sx={{ mt: 1 }}>
                    {question.pairs ? 
                      (matchingAnswers[item] !== question.pairs.find(p => p.item === item)?.description && (
                        <Typography variant="body2\" color="success.main">
                          Correct match: {question.pairs.find(p => p.item === item)?.description}
                        </Typography>
                      )) :
                      (question.answers && matchingAnswers[item] !== question.answers[item] && (
                        <Typography variant="body2" color="success.main">
                          Correct match: {question.answers[item]}
                        </Typography>
                      ))
                    }
                  </Box>
                )}
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
                    color={getCheckboxColor(option)}
                    sx={{
                      '&.Mui-checked': {
                        color: submitted && showFeedback ? 
                          (Array.isArray(question.answer) && question.answer.includes(option) ? 'success.main' : 
                           Array.isArray(answer) && answer.includes(option) ? 'error.main' : undefined) : 
                          undefined
                      }
                    }}
                  />
                }
                label={option}
                sx={{
                  ...(submitted && showFeedback && Array.isArray(question.answer) && question.answer.includes(option) && {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 1,
                    px: 1
                  })
                }}
              />
            ))}
          </FormGroup>
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
      
      {submitted && showFeedback && question.explanation && !['short-answer', 'critical-thinking', 'fill-in-the-blank'].includes(question.type) && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color={isCorrect ? "success.main" : "error.main"}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Explanation:
          </Typography>
          <Typography variant="body1">
            {question.explanation}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default QuestionRenderer
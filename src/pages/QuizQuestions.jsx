import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Container, 
  Button, 
  Box, 
  LinearProgress,
  Breadcrumbs,
  Link,
  Pagination,
  Paper,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import { loadQuizQuestions } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'
import QuestionRenderer from '../components/QuestionRenderer'
import QuestionNavigation from '../components/QuestionNavigation'

function QuizQuestions() {
  const { subject, chapter } = useParams()
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [questionsPerPage] = useState(1)
  const [userAnswers, setUserAnswers] = useState({})
  const [results, setResults] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const navigate = useNavigate()
  const { 
    updateQuestionProgress, 
    getQuestionProgress, 
    getChapterProgress 
  } = useUserProgress()

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const questionsData = await loadQuizQuestions(subject, chapter)
        if (questionsData && questionsData.questions) {
          setQuestions(questionsData.questions)
          
          // Filter questions to only include multiple-choice, select all that apply, and true-false
          const allowedTypes = ['multiple-choice', 'select all that apply', 'true-false']
          const filtered = questionsData.questions.filter(q => allowedTypes.includes(q.type))
          setFilteredQuestions(filtered)
          
          // Initialize user answers and results
          const initialAnswers = {}
          const initialResults = {}
          
          filtered.forEach((_, index) => {
            const result = getQuestionProgress(subject, chapter, 'quiz', index)
            if (result !== null) {
              initialResults[index] = result
            }
          })
          
          setUserAnswers(initialAnswers)
          setResults(initialResults)
          
          // Check if all questions have been answered
          if (Object.keys(initialResults).length === filtered.length) {
            setQuizSubmitted(true)
          }
        } else {
          setError('Quiz not found')
        }
      } catch (err) {
        console.error('Error loading quiz:', err)
        setError('Failed to load quiz questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [subject, chapter, getQuestionProgress])

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    // Scroll to top when changing questions
    window.scrollTo(0, 0)
  }

  const handleAnswer = (answer, isCorrect) => {
    const questionIndex = indexOfFirstQuestion
    
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
    
    setResults(prev => ({
      ...prev,
      [questionIndex]: isCorrect
    }))
    
    updateQuestionProgress(subject, chapter, 'quiz', questionIndex, isCorrect)
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
    setShowSubmitDialog(false)
  }

  // Calculate progress
  const progress = getChapterProgress(subject, chapter, 'quiz')
  const questionsProgress = getChapterProgress(subject, chapter, 'chapter')
  
  // Get current question
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading...
        </Typography>
        <LinearProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/subjects/${subject}`)}>
          Back to Subject
        </Button>
      </Container>
    )
  }

  if (filteredQuestions.length === 0) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          No Quiz Available
        </Typography>
        <Typography variant="body1" paragraph>
          There are no quiz questions available for this chapter.
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/subjects/${subject}/${chapter}/summary`)}>
          Back to Summary
        </Button>
      </Container>
    )
  }

  // Calculate quiz results
  const totalQuestions = filteredQuestions.length
  const answeredQuestions = Object.keys(results).length
  const correctAnswers = Object.values(results).filter(result => result === true).length
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Dashboard
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate(`/subjects/${subject}`)}
          sx={{ cursor: 'pointer' }}
        >
          {subject.charAt(0).toUpperCase() + subject.slice(1)}
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate(`/subjects/${subject}/${chapter}/summary`)}
          sx={{ cursor: 'pointer' }}
        >
          Chapter {chapter}
        </Link>
        <Typography color="text.primary">Quiz</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Chapter {chapter} Quiz
      </Typography>

      {/* Learning Path Stepper */}
      <Stepper activeStep={2} sx={{ mb: 4 }}>
        <Step completed={true}>
          <StepLabel>Read Summary</StepLabel>
        </Step>
        <Step completed={questionsProgress.attempted > 0}>
          <StepLabel>Practice Questions</StepLabel>
        </Step>
        <Step completed={progress.attempted > 0}>
          <StepLabel>Take Quiz</StepLabel>
        </Step>
      </Stepper>

      {quizSubmitted && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Quiz Results
          </Typography>
          <Typography variant="body1">
            You answered {correctAnswers} out of {totalQuestions} questions correctly.
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Score: {Math.round(score)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={score} 
            sx={{ mt: 1, mb: 2 }}
          />
          
          {score >= 80 ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Excellent work! You've mastered this chapter.
            </Alert>
          ) : score >= 60 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Good job! Review the questions you missed to improve your understanding.
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You might need to review this chapter more thoroughly.
            </Alert>
          )}
        </Paper>
      )}

      {!quizSubmitted && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">
            Quiz progress: {answeredQuestions}/{totalQuestions} questions answered
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(answeredQuestions / totalQuestions) * 100} 
            sx={{ mt: 1 }}
          />
        </Paper>
      )}

      {currentQuestions.map((question, index) => {
        const questionIndex = indexOfFirstQuestion + index
        const savedAnswer = userAnswers[questionIndex] || null
        const savedResult = results[questionIndex] || null
        
        return (
          <QuestionRenderer
            key={questionIndex}
            question={question}
            questionNumber={questionIndex + 1}
            onAnswer={handleAnswer}
            showFeedback={quizSubmitted}
            savedAnswer={savedAnswer}
            savedResult={savedResult}
          />
        )
      })}

      <QuestionNavigation 
        currentPage={currentPage}
        totalPages={Math.ceil(filteredQuestions.length / questionsPerPage)}
        onPageChange={handlePageChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Pagination 
          count={Math.ceil(filteredQuestions.length / questionsPerPage)} 
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/subjects/${subject}/${chapter}/questions`)}
        >
          Back to Practice Questions
        </Button>
        
        {!quizSubmitted && answeredQuestions === totalQuestions && (
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => setShowSubmitDialog(true)}
          >
            Submit Quiz
          </Button>
        )}
        
        {quizSubmitted && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate(`/subjects/${subject}`)}
          >
            Back to Chapter List
          </Button>
        )}
      </Box>

      {/* Submit Quiz Confirmation Dialog */}
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitQuiz} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default QuizQuestions
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
  DialogTitle
} from '@mui/material'
import { loadQuizQuestions } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'
import QuestionRenderer from '../components/QuestionRenderer'
import QuestionNavigation from '../components/QuestionNavigation'

function QuizQuestions() {
  const { subject, chapter } = useParams()
  const [questions, setQuestions] = useState([])
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
          
          // Initialize user answers and results
          const initialAnswers = {}
          const initialResults = {}
          
          questionsData.questions.forEach((_, index) => {
            const result = getQuestionProgress(subject, chapter, 'quiz', index)
            if (result !== null) {
              initialResults[index] = result
            }
          })
          
          setUserAnswers(initialAnswers)
          setResults(initialResults)
          
          // Check if all questions have been answered
          if (Object.keys(initialResults).length === questionsData.questions.length) {
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
  
  // Get current question
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion)

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

  if (questions.length === 0) {
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
  const totalQuestions = questions.length
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
            <Alert severity="success\" sx={{ mt: 2 }}>
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
        totalPages={Math.ceil(questions.length / questionsPerPage)}
        onPageChange={handlePageChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
        <Pagination 
          count={Math.ceil(questions.length / questionsPerPage)} 
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/subjects/${subject}/${chapter}/summary`)}
        >
          Back to Summary
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
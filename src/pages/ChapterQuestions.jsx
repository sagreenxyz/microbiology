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
  Alert
} from '@mui/material'
import { loadChapterQuestions } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'
import QuestionRenderer from '../components/QuestionRenderer'
import QuestionNavigation from '../components/QuestionNavigation'

function ChapterQuestions() {
  const { subject, chapter } = useParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [questionsPerPage] = useState(1)
  const navigate = useNavigate()
  const { 
    updateQuestionProgress, 
    getQuestionProgress, 
    getChapterProgress 
  } = useUserProgress()

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const questionsData = await loadChapterQuestions(subject, chapter)
        if (questionsData && questionsData.questions) {
          setQuestions(questionsData.questions)
        } else {
          setError('Questions not found')
        }
      } catch (err) {
        console.error('Error loading questions:', err)
        setError('Failed to load chapter questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [subject, chapter])

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    // Scroll to top when changing questions
    window.scrollTo(0, 0)
  }

  const handleAnswer = (questionIndex, answer, isCorrect) => {
    updateQuestionProgress(subject, chapter, 'chapter', questionIndex, isCorrect)
  }

  // Calculate progress
  const progress = getChapterProgress(subject, chapter, 'chapter')
  
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
          No Questions Available
        </Typography>
        <Typography variant="body1" paragraph>
          There are no practice questions available for this chapter.
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/subjects/${subject}/${chapter}/summary`)}>
          Back to Summary
        </Button>
      </Container>
    )
  }

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
        <Typography color="text.primary">Practice Questions</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Chapter {chapter} Practice Questions
      </Typography>

      {progress.attempted > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">
            Your progress: {progress.correct}/{progress.attempted} questions correct ({Math.round(progress.percentage)}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress.percentage} 
            sx={{ mt: 1 }}
          />
        </Paper>
      )}

      {currentQuestions.map((question, index) => {
        const questionIndex = indexOfFirstQuestion + index
        const savedAnswer = null // We don't save answers for practice questions
        const savedResult = getQuestionProgress(subject, chapter, 'chapter', questionIndex)
        
        return (
          <QuestionRenderer
            key={questionIndex}
            question={question}
            questionNumber={questionIndex + 1}
            onAnswer={(answer, isCorrect) => handleAnswer(questionIndex, answer, isCorrect)}
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
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => navigate(`/subjects/${subject}/${chapter}/quiz`)}
        >
          Take Quiz
        </Button>
      </Box>
    </Container>
  )
}

export default ChapterQuestions
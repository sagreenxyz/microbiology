import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Box, 
  LinearProgress,
  Breadcrumbs,
  Link,
  Divider,
  Card,
  CardContent,
  CardActions,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadChapterSummary } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'
import SummarizeIcon from '@mui/icons-material/Summarize'
import ScienceIcon from '@mui/icons-material/Science'
import QuizIcon from '@mui/icons-material/Quiz'

function ChapterPage() {
  const { subject, chapter } = useParams()
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { getChapterProgress } = useUserProgress()

  useEffect(() => {
    async function fetchSummary() {
      try {
        const summaryContent = await loadChapterSummary(subject, chapter)
        if (summaryContent) {
          setSummary(summaryContent)
        } else {
          setError('Summary not found')
        }
      } catch (err) {
        console.error('Error loading summary:', err)
        setError('Failed to load chapter summary')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [subject, chapter])

  // Get progress for chapter questions and quiz
  const questionsProgress = getChapterProgress(subject, chapter, 'chapter')
  const quizProgress = getChapterProgress(subject, chapter, 'quiz')

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
        <Typography color="text.primary">Chapter {chapter} Summary</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Chapter {chapter} Study Materials
      </Typography>

      {/* Learning Path Stepper */}
      <Stepper activeStep={0} sx={{ mb: 4 }}>
        <Step completed={true}>
          <StepLabel>Read Summary</StepLabel>
        </Step>
        <Step completed={questionsProgress.attempted > 0}>
          <StepLabel>Practice Questions</StepLabel>
        </Step>
        <Step completed={quizProgress.attempted > 0}>
          <StepLabel>Take Quiz</StepLabel>
        </Step>
      </Stepper>

      {/* Study Materials Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SummarizeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">1. Summary</Typography>
              </Box>
              <Typography variant="body2">
                Read the chapter summary to understand key concepts and principles.
              </Typography>
            </CardContent>
            <CardActions>
              <Typography variant="body2" sx={{ ml: 1 }}>
                You are here
              </Typography>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon sx={{ mr: 1 }} />
                <Typography variant="h6">2. Practice Questions</Typography>
              </Box>
              <Typography variant="body2">
                Test your understanding with chapter practice questions.
              </Typography>
              {questionsProgress.attempted > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Progress: {questionsProgress.correct}/{questionsProgress.attempted} correct
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={questionsProgress.percentage} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate(`/subjects/${subject}/${chapter}/questions`)}
                variant="contained"
              >
                {questionsProgress.attempted > 0 ? 'Continue Practice' : 'Start Practice'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuizIcon sx={{ mr: 1 }} />
                <Typography variant="h6">3. Quiz</Typography>
              </Box>
              <Typography variant="body2">
                Take the chapter quiz to test your knowledge.
              </Typography>
              {quizProgress.attempted > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Score: {quizProgress.correct}/{quizProgress.attempted} correct
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={quizProgress.percentage} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate(`/subjects/${subject}/${chapter}/quiz`)}
                variant="contained"
                color="secondary"
              >
                {quizProgress.attempted > 0 ? 'Review Quiz' : 'Take Quiz'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Chapter Summary
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {summary}
        </ReactMarkdown>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/subjects/${subject}`)}
        >
          Back to Chapters
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/subjects/${subject}/${chapter}/questions`)}
        >
          Continue to Practice Questions
        </Button>
      </Box>
    </Container>
  )
}

export default ChapterPage
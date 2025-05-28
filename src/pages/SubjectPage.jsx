import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  LinearProgress,
  Box,
  Breadcrumbs,
  Link
} from '@mui/material'
import { getAvailableSubjects, getChapterDetails } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'

function SubjectPage() {
  const { subject } = useParams()
  const [subjectData, setSubjectData] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { getChapterProgress } = useUserProgress()

  useEffect(() => {
    async function loadSubjectData() {
      try {
        const subjects = await getAvailableSubjects()
        const currentSubject = subjects.find(s => s.id === subject)
        
        if (!currentSubject) {
          console.error('Subject not found')
          navigate('/')
          return
        }
        
        setSubjectData(currentSubject)
        
        // Load chapter details
        const chapterPromises = Array.from({ length: currentSubject.chapters }, (_, i) => {
          const chapterNumber = String(i + 1).padStart(2, '0')
          return getChapterDetails(subject, chapterNumber)
        })
        
        const chapterDetails = await Promise.all(chapterPromises)
        setChapters(chapterDetails)
      } catch (error) {
        console.error('Error loading subject data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubjectData()
  }, [subject, navigate])

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

  if (!subjectData) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Subject not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Dashboard
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
        <Typography color="text.primary">{subjectData.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        {subjectData.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {subjectData.description}
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Chapters
      </Typography>

      <Grid container spacing={3}>
        {chapters.map((chapter) => {
          const summaryProgress = getChapterProgress(subject, chapter.id, 'chapter')
          const quizProgress = getChapterProgress(subject, chapter.id, 'quiz')
          
          return (
            <Grid item xs={12} sm={6} md={4} key={chapter.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Chapter {chapter.number}
                  </Typography>
                  
                  {summaryProgress.attempted > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Chapter Questions: {summaryProgress.correct}/{summaryProgress.attempted} ({Math.round(summaryProgress.percentage)}%)
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={summaryProgress.percentage} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                  
                  {quizProgress.attempted > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Quiz: {quizProgress.correct}/{quizProgress.attempted} ({Math.round(quizProgress.percentage)}%)
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
                    onClick={() => navigate(`/subjects/${subject}/${chapter.id}/summary`)}
                  >
                    Summary
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/subjects/${subject}/${chapter.id}/questions`)}
                  >
                    Questions
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/subjects/${subject}/${chapter.id}/quiz`)}
                  >
                    Quiz
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default SubjectPage
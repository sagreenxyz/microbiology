import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  LinearProgress,
  Box
} from '@mui/material'
import { getAvailableSubjects } from '../utils/dataLoader'
import { useUserProgress } from '../contexts/UserProgressContext'

function Dashboard() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { getSubjectProgress } = useUserProgress()

  useEffect(() => {
    async function loadSubjects() {
      try {
        const availableSubjects = await getAvailableSubjects()
        setSubjects(availableSubjects)
      } catch (error) {
        console.error('Error loading subjects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubjects()
  }, [])

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

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Learning Management System
      </Typography>
      <Typography variant="body1" paragraph>
        Select a subject to begin studying. Track your progress as you work through chapters, 
        complete practice questions, and take quizzes.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {subjects.map((subject) => {
          const progress = getSubjectProgress(subject.id)
          
          return (
            <Grid item xs={12} sm={6} md={4} key={subject.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {subject.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {subject.description}
                  </Typography>
                  <Typography variant="body2">
                    {subject.chapters} chapters
                  </Typography>
                  
                  {progress.attempted > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Progress: {progress.correct}/{progress.attempted} questions correct ({Math.round(progress.percentage)}%)
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress.percentage} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/subjects/${subject.id}`)}
                  >
                    Start Learning
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

export default Dashboard
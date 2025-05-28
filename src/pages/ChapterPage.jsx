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
  Divider
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadChapterSummary } from '../utils/dataLoader'

function ChapterPage() {
  const { subject, chapter } = useParams()
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate(`/subjects/${subject}/${chapter}/questions`)}
            sx={{ mr: 2 }}
          >
            Practice Questions
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate(`/subjects/${subject}/${chapter}/quiz`)}
          >
            Take Quiz
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ChapterPage
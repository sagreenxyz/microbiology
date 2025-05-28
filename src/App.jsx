import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SubjectPage from './pages/SubjectPage'
import ChapterPage from './pages/ChapterPage'
import ChapterQuestions from './pages/ChapterQuestions'
import QuizQuestions from './pages/QuizQuestions'
import { UserProgressProvider } from './contexts/UserProgressContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
  },
})

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has a preference stored
    const storedPreference = localStorage.getItem('darkMode')
    if (storedPreference !== null) {
      setDarkMode(storedPreference === 'true')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <UserProgressProvider>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Header 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            toggleDrawer={toggleDrawer} 
          />
          <Sidebar 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            onNavigate={handleNavigate}
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subjects/:subject" element={<SubjectPage />} />
              <Route path="/subjects/:subject/:chapter/summary" element={<ChapterPage />} />
              <Route path="/subjects/:subject/:chapter/questions" element={<ChapterQuestions />} />
              <Route path="/subjects/:subject/:chapter/quiz" element={<QuizQuestions />} />
            </Routes>
          </Box>
        </Box>
      </UserProgressProvider>
    </ThemeProvider>
  )
}

export default App
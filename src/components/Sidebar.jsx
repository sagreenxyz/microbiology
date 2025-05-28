import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SchoolIcon from '@mui/icons-material/School'
import ScienceIcon from '@mui/icons-material/Science'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import QuizIcon from '@mui/icons-material/Quiz'
import SummarizeIcon from '@mui/icons-material/Summarize'

const drawerWidth = 280

function Sidebar({ open, onClose, onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [subjects, setSubjects] = useState([])
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [expandedChapters, setExpandedChapters] = useState({})

  useEffect(() => {
    // In a real app, this would be fetched from an API
    setSubjects([
      {
        id: 'microbiology',
        name: 'Microbiology',
        chapters: Array.from({ length: 26 }, (_, i) => ({
          id: String(i + 1).padStart(2, '0'),
          name: `Chapter ${i + 1}`
        }))
      }
    ])

    // Set expanded state based on current URL
    const pathParts = location.pathname.split('/')
    if (pathParts.length > 2) {
      setExpandedSubject(pathParts[2])
      
      if (pathParts.length > 3) {
        setExpandedChapters(prev => ({
          ...prev,
          [pathParts[3]]: true
        }))
      }
    }
  }, [location.pathname])

  const handleSubjectClick = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId)
  }

  const handleChapterClick = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {subjects.map((subject) => (
          <Box key={subject.id}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSubjectClick(subject.id)}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary={subject.name} />
                {expandedSubject === subject.id ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={expandedSubject === subject.id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subject.chapters.map((chapter) => (
                  <Box key={chapter.id}>
                    <ListItemButton 
                      sx={{ pl: 4 }}
                      onClick={() => handleChapterClick(chapter.id)}
                    >
                      <ListItemIcon>
                        <MenuBookIcon />
                      </ListItemIcon>
                      <ListItemText primary={chapter.name} />
                      {expandedChapters[chapter.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={!!expandedChapters[chapter.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton 
                          sx={{ pl: 6 }}
                          onClick={() => onNavigate(`/subjects/${subject.id}/${chapter.id}/summary`)}
                        >
                          <ListItemIcon>
                            <SummarizeIcon />
                          </ListItemIcon>
                          <ListItemText primary="Summary" />
                        </ListItemButton>
                        <ListItemButton 
                          sx={{ pl: 6 }}
                          onClick={() => onNavigate(`/subjects/${subject.id}/${chapter.id}/questions`)}
                        >
                          <ListItemIcon>
                            <ScienceIcon />
                          </ListItemIcon>
                          <ListItemText primary="Chapter Questions" />
                        </ListItemButton>
                        <ListItemButton 
                          sx={{ pl: 6 }}
                          onClick={() => onNavigate(`/subjects/${subject.id}/${chapter.id}/quiz`)}
                        >
                          <ListItemIcon>
                            <QuizIcon />
                          </ListItemIcon>
                          <ListItemText primary="Quiz" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </div>
  )

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      {drawer}
    </Drawer>
  )
}

export default Sidebar
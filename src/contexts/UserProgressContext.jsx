import { createContext, useState, useEffect, useContext } from 'react'

const UserProgressContext = createContext()

export function useUserProgress() {
  return useContext(UserProgressContext)
}

export function UserProgressProvider({ children }) {
  const [progress, setProgress] = useState({})

  useEffect(() => {
    // Load progress from localStorage on component mount
    const savedProgress = localStorage.getItem('userProgress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }, [progress])

  const updateQuestionProgress = (subject, chapter, questionType, questionId, isCorrect) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress }
      
      if (!newProgress[subject]) {
        newProgress[subject] = {}
      }
      
      if (!newProgress[subject][chapter]) {
        newProgress[subject][chapter] = {}
      }
      
      if (!newProgress[subject][chapter][questionType]) {
        newProgress[subject][chapter][questionType] = {}
      }
      
      newProgress[subject][chapter][questionType][questionId] = isCorrect
      
      return newProgress
    })
  }

  const getQuestionProgress = (subject, chapter, questionType, questionId) => {
    if (!progress[subject] || 
        !progress[subject][chapter] || 
        !progress[subject][chapter][questionType]) {
      return null
    }
    
    return progress[subject][chapter][questionType][questionId]
  }

  const getChapterProgress = (subject, chapter, questionType) => {
    if (!progress[subject] || 
        !progress[subject][chapter] || 
        !progress[subject][chapter][questionType]) {
      return { attempted: 0, correct: 0, total: 0, percentage: 0 }
    }
    
    const questionProgress = progress[subject][chapter][questionType]
    const attempted = Object.keys(questionProgress).length
    const correct = Object.values(questionProgress).filter(val => val === true).length
    
    return { attempted, correct, percentage: attempted > 0 ? (correct / attempted) * 100 : 0 }
  }

  const getSubjectProgress = (subject) => {
    if (!progress[subject]) {
      return { attempted: 0, correct: 0, total: 0, percentage: 0 }
    }
    
    let totalAttempted = 0
    let totalCorrect = 0
    
    Object.keys(progress[subject]).forEach(chapter => {
      Object.keys(progress[subject][chapter]).forEach(questionType => {
        const questionProgress = progress[subject][chapter][questionType]
        totalAttempted += Object.keys(questionProgress).length
        totalCorrect += Object.values(questionProgress).filter(val => val === true).length
      })
    })
    
    return { 
      attempted: totalAttempted, 
      correct: totalCorrect, 
      percentage: totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0 
    }
  }

  const resetProgress = (subject, chapter, questionType) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress }
      
      if (subject && chapter && questionType) {
        // Reset specific question type in a chapter
        if (newProgress[subject] && newProgress[subject][chapter]) {
          newProgress[subject][chapter][questionType] = {}
        }
      } else if (subject && chapter) {
        // Reset entire chapter
        if (newProgress[subject]) {
          newProgress[subject][chapter] = {}
        }
      } else if (subject) {
        // Reset entire subject
        newProgress[subject] = {}
      } else {
        // Reset all progress
        return {}
      }
      
      return newProgress
    })
  }

  const value = {
    updateQuestionProgress,
    getQuestionProgress,
    getChapterProgress,
    getSubjectProgress,
    resetProgress
  }

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  )
}
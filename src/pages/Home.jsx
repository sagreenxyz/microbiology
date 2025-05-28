import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Get all chapter files
        const chapterFiles = [
          'microbiology-chapter-01.json',
          'microbiology-chapter-02.json',
          'microbiology-chapter-03.json',
          'microbiology-chapter-04.json',
          'microbiology-chapter-05.json',
          'microbiology-chapter-06.json',
          'microbiology-chapter-07.json',
          'microbiology-chapter-08.json',
          'microbiology-chapter-09.json',
          'microbiology-chapter-10.json',
          'microbiology-chapter-12.json',
          'microbiology-chapter-13.json',
          'microbiology-chapter-14.json',
          'microbiology-chapter-15.json',
          'microbiology-chapter-16.json',
          'microbiology-chapter-17.json',
          'microbiology-chapter-18.json',
          'microbiology-chapter-19.json',
          'microbiology-chapter-20.json',
          'microbiology-chapter-21.json',
          'microbiology-chapter-22.json',
          'microbiology-chapter-23.json',
          'microbiology-chapter-24.json',
          'microbiology-chapter-25.json',
          'microbiology-chapter-26.json'
        ]

        const chapterData = await Promise.all(
          chapterFiles.map(async (file) => {
            const response = await fetch(file)
            if (!response.ok) {
              throw new Error(`Failed to fetch ${file}`)
            }
            const data = await response.json()
            const chapterId = file.match(/microbiology-chapter-(\d+)\.json/)[1]
            return {
              id: chapterId,
              title: data.title,
              questionCount: data.questions.length
            }
          })
        )

        // Sort chapters by ID
        chapterData.sort((a, b) => parseInt(a.id) - parseInt(b.id))
        setChapters(chapterData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching chapters:', err)
        setError('Failed to load chapters. Please try again later.')
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Microbiology Quiz</h1>
        <p className="text-lg">Select a chapter to start the quiz:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <Link 
            key={chapter.id}
            to={`/quiz/${chapter.id}`}
            className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg shadow-md p-6 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Chapter {chapter.id}</h2>
            <p className="text-gray-600 mb-4">{chapter.title}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{chapter.questionCount} questions</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Start Quiz</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
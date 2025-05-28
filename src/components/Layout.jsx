import { Link } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18h8"></path>
              <path d="M3 22h18"></path>
              <path d="M14 22a4 4 0 0 1-4-4"></path>
              <path d="M14 18a4 4 0 0 0 0-8"></path>
              <path d="M11 10V6a2 2 0 0 1 2-2h2"></path>
              <circle cx="15" cy="5" r="1"></circle>
            </svg>
            Microbiology Quiz
          </Link>
          <nav>
            <Link to="/" className="text-white hover:text-blue-200 transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Microbiology Quiz App - Created with React</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StartScreen() {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleStartGame = () => {
    navigate('/join')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center relative overflow-hidden">
      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-4 h-4 bg-black rounded-full"></div>
        <div className="absolute top-32 left-40 w-3 h-3 bg-black rounded-full"></div>
        <div className="absolute top-48 left-60 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-64 left-80 w-4 h-4 bg-black rounded-full"></div>
        <div className="absolute top-80 left-96 w-3 h-3 bg-black rounded-full"></div>
        
        <div className="absolute top-40 right-20 w-3 h-3 bg-black rounded-full"></div>
        <div className="absolute top-60 right-40 w-4 h-4 bg-black rounded-full"></div>
        <div className="absolute top-80 right-60 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-96 right-80 w-3 h-3 bg-black rounded-full"></div>
        
        <div className="absolute bottom-20 left-32 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute bottom-40 left-52 w-4 h-4 bg-black rounded-full"></div>
        <div className="absolute bottom-60 left-72 w-3 h-3 bg-black rounded-full"></div>
        
        <div className="absolute bottom-32 right-32 w-3 h-3 bg-black rounded-full"></div>
        <div className="absolute bottom-52 right-52 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute bottom-72 right-72 w-4 h-4 bg-black rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <button
          onClick={handleStartGame}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-white border-4 border-black rounded-2xl px-16 py-8 text-black font-black text-6xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em',
            lineHeight: '1.1'
          }}
        >
          Gumball Run
        </button>
      </div>
    </div>
  )
}

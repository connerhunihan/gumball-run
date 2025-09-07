import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Tutorial() {
  const location = useLocation()
  const navigate = useNavigate()
  const { team1Players, team2Players } = location.state || {}
  
  const [guess, setGuess] = useState('')

  const handleStartGame = () => {
    navigate('/team-competition', { 
      state: { 
        team1Players,
        team2Players,
        currentTeam: 'team1',
        round: 1,
        team1Score: 0,
        team2Score: 0
      } 
    })
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Left panel - Instructions */}
        <div className="flex-1">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            {/* Timer placeholder */}
            <div className="h-16 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-black font-light text-2xl tracking-widest">TIMER</span>
            </div>
            
            {/* Main area with tutorial image */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Tutorial image placeholder */}
              <div className="w-full h-80 mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">Tutorial Image</span>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-left mb-6">
              <p className="text-black font-normal text-3xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                You make your own guess ...
              </p>
              <div className="bg-white border-4 border-black rounded-2xl p-4">
                <input
                  type="text"
                  placeholder="enter a number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full text-left text-3xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                  style={{ fontFamily: 'Lexend Exa, sans-serif' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Example */}
        <div className="flex-1">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            {/* Timer with countdown */}
            <div className="h-16 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-black font-light text-2xl tracking-widest">STARTS IN 10</span>
            </div>
            
            {/* Main area with example */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6 relative">
              {/* Example image */}
              <div className="w-full h-80 mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">Example Gumball</span>
              </div>
              
              {/* Example guess tag */}
              <div className="absolute bottom-4 right-4">
                <div className="bg-[#ffff00] border-2 border-black rounded px-4 py-2 mb-2">
                  <span className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                    Medium
                  </span>
                </div>
                <div className="bg-white border-2 border-black rounded px-4 py-2">
                  <span className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                    256
                  </span>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-left mb-6">
              <p className="text-black font-normal text-3xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                ... you guess with a estimate
              </p>
              <div className="bg-white border-4 border-black rounded-2xl p-4">
                <input
                  type="text"
                  placeholder="enter a number"
                  className="w-full text-left text-3xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                  style={{ fontFamily: 'Lexend Exa, sans-serif' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-black font-black text-6xl" style={{ 
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-0.07em'
        }}>
          Here's how it works
        </h1>
      </div>

      {/* Start Game button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleStartGame}
          className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em'
          }}
        >
          START GAME
        </button>
      </div>
    </div>
  )
}


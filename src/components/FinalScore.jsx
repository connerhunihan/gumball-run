import { useLocation, useNavigate } from 'react-router-dom'

export default function FinalScore() {
  const location = useLocation()
  const navigate = useNavigate()
  const { team1Players, team2Players, scores } = location.state || { scores: { team1: 139, team2: 118 } }
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard')
  }

  const handlePlayAgain = () => {
    navigate('/join')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Team 1 Score - Guestimators */}
        <div className="flex-1">
          <div className="p-8 text-center">
            {/* Timer area - empty/transparent */}
            <div className="h-16 mb-4"></div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball image */}
              <div className="w-64 h-56 mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">Gumball Image</span>
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Guestimators
                </h2>
              </div>
            </div>
            
            {/* Score display - no fill, no border */}
            <div className="py-6">
              <span className="text-black font-black text-6xl" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}>
                {scores.team1 || 139}
              </span>
            </div>
          </div>
        </div>

        {/* Team 2 Score - Quote warriors */}
        <div className="flex-1">
          <div className="p-8 text-center">
            {/* Timer area - empty/transparent */}
            <div className="h-16 mb-4"></div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball image */}
              <div className="w-64 h-56 mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">Gumball Image</span>
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Quote warriors
                </h2>
              </div>
            </div>
            
            {/* Score display - no fill, no border */}
            <div className="py-6">
              <span className="text-black font-black text-6xl" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}>
                {scores.team2 || 118}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleViewLeaderboard}
          className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em'
          }}
        >
          LEADERBOARD
        </button>
      </div>
    </div>
  )
}
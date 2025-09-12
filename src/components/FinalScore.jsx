import { useLocation, useNavigate } from 'react-router-dom'
import TeamStats from './TeamStats.jsx'

export default function FinalScore() {
  const location = useLocation()
  const navigate = useNavigate()
  const { scores, roomId, stats } = location.state || { 
    scores: { team1: 0, team2: 0 },
    stats: { team1: { guessCount: 0, totalAccuracy: 0 }, team2: { guessCount: 0, totalAccuracy: 0 } }
  }
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { 
      state: { 
        team1Players: location.state?.team1Players || [],
        team2Players: location.state?.team2Players || [],
        scores: location.state?.scores || { team1: 0, team2: 0 },
        fromHomepage: location.state?.fromHomepage || false
      } 
    })
  }

  const handlePlayAgain = () => {
    navigate('/join')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex flex-col items-center justify-center p-8">
      
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Team 1 Score - Guestimators */}
        <div className="flex-1">
          <div className="p-8 text-center">
            {/* Team name and score */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8">
              <h2 className="text-black font-normal text-3xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                Guestimators
              </h2>
              <div className="text-black font-black text-6xl mb-6" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}>
                {scores.team1}
              </div>
              
              {/* Team Stats */}
              <div className="mt-4">
                <TeamStats 
                  accuracy={stats.team1.totalAccuracy} 
                  guessCount={stats.team1.guessCount} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team 2 Score - Quote warriors */}
        <div className="flex-1">
          <div className="p-8 text-center">
            {/* Team name and score */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8">
              <h2 className="text-black font-normal text-3xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                Quote warriors
              </h2>
              <div className="text-black font-black text-6xl mb-6" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}>
                {scores.team2}
              </div>
              
              {/* Team Stats */}
              <div className="mt-4">
                <TeamStats 
                  accuracy={stats.team2.totalAccuracy} 
                  guessCount={stats.team2.guessCount} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={handlePlayAgain}
          className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em'
          }}
        >
          PLAY AGAIN
        </button>
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
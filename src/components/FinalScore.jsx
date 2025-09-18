import { useLocation, useNavigate } from 'react-router-dom'

export default function FinalScore() {
  const location = useLocation()
  const navigate = useNavigate()
  const { players } = location.state || { players: [] }

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { 
      state: { 
        fromHomepage: location.state?.fromHomepage || false
      } 
    })
  }

  const handlePlayAgain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex flex-col items-center justify-center p-8">
      
      <div className="w-full max-w-6xl">
        <h1 className="text-black font-black text-5xl mb-8 text-center" style={{
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-4.48px',
          lineHeight: '89.6px'
        }}>
          HIGH SCORES
        </h1>

        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={player.id || index} className="border-4 border-black rounded-2xl p-6 flex items-center justify-between gap-8">
              {/* Large score number */}
              <div className="text-6xl font-black text-black text-center" style={{
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-4.48px',
                lineHeight: '89.6px',
                minWidth: '200px'
              }}>
                {player.score}
              </div>
              
              {/* Player Name */}
              <div className="flex-grow text-center">
                <h2 className="text-4xl font-semibold leading-tight tracking-tight text-black" style={{ fontFamily: "'Lexend Exa', sans-serif" }}>
                  {player.name}
                </h2>
              </div>

              {/* Stats Tags */}
              <div className="flex items-center gap-4">
                {/* Accuracy Tag */}
                <div className="bg-yellow-400 border-2 border-black rounded-md px-4 py-2 flex items-center justify-center">
                  <span className="text-black text-xl font-normal" style={{
                    fontFamily: 'Lexend Exa, sans-serif',
                    letterSpacing: '-2.24px',
                    lineHeight: '44.8px'
                  }}>
                    {Math.round((player.totalAccuracy || 0) / Math.max(1, player.guessCount || 1) * 100)}%
                  </span>
                </div>
                <div className="bg-white border-2 border-black rounded px-4 py-2">
                  <span className="text-black text-xl font-normal" style={{
                    fontFamily: 'Lexend Exa, sans-serif',
                    letterSpacing: '-2.24px',
                    lineHeight: '44.8px'
                  }}>
                    Guesses: {player.guessCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={handlePlayAgain}
          className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover-shadow-lg"
          style={{ 
            boxShadow: '8px 8px 0px 0px #000000',
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em'
          }}
        >
          PLAY AGAIN
        </button>
        <button
          onClick={handleViewLeaderboard}
          className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover-shadow-lg"
          style={{ 
            boxShadow: '8px 8px 0px 0px #000000',
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
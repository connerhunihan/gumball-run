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
              
              {/* Player name */}
              <div className="flex-1 px-12">
                <div className="text-2xl text-black" style={{
                  fontFamily: 'Lexend Exa, sans-serif',
                  letterSpacing: '0px',
                  lineHeight: '44.8px'
                }}>
                  {player.name}
                </div>
              </div>
              
              {/* Stats tags and method */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {player.guessingMethod === 'manual' ? (
                    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M29.4023 6.5C30.521 4.56276 33.2641 4.50223 34.4844 6.31836L34.5977 6.5L55.3828 42.5C56.5375 44.5 55.0936 47 52.7842 47H11.2158C8.90644 47 7.46254 44.5 8.61719 42.5L29.4023 6.5Z" fill="#FF4910" stroke="white" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <div className="w-12 h-12 bg-blue-500 rounded-full border-2 border-black"></div>
                  )}
                  <span className="text-2xl text-black" style={{
                    fontFamily: 'Lexend Exa, sans-serif',
                    letterSpacing: '0px',
                    lineHeight: '44.8px'
                  }}>
                    {player.guessingMethod === 'manual' ? 'MANUAL' : 'ESTIMATE'}
                  </span>
                </div>
                <div className="bg-[#e2ff33] border-2 border-black rounded px-4 py-2">
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
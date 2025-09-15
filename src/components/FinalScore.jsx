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
      
      <div className="w-full max-w-2xl bg-white border-4 border-black rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">Final Scores</h1>
        <ol className="list-decimal list-inside text-left space-y-4">
          {players.map((player, index) => (
            <li key={player.id || index} className="flex justify-between text-2xl">
              <span>{index + 1}. {player.name}</span>
              <span>{player.score}</span>
            </li>
          ))}
        </ol>
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
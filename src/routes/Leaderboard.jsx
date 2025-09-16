import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function loadLeaders() {
  try {
    return JSON.parse(localStorage.getItem('leaders') || '[]')
  } catch {
    return []
  }
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    setLeaders(loadLeaders())
  }, [])

  const handlePlayAgain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-black font-black text-5xl mb-8 text-center" style={{
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-4.48px',
          lineHeight: '89.6px'
        }}>
          HIGH SCORES
        </h1>

        <div 
          className="bg-white border-4 border-black p-6 mx-auto"
          style={{
            borderRadius: '32px',
            boxShadow: '8px 8px 0px 0px #000000',
            maxWidth: '800px'
          }}
        >
          <h2 className="font-black text-2xl mb-6 text-black text-center" style={{
            fontFamily: 'Lexend Exa, sans-serif'
          }}>
            Leaderboard
          </h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b-2 border-black">
                  <th className="text-left px-3 py-3 font-bold text-black">Rank</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Name</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Score</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Accuracy</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Guesses</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((l, i) => (
                  <tr key={l.id || i} className="border-b border-gray-300">
                    <td className="text-left px-3 py-3 font-bold text-black">{i + 1}</td>
                    <td className="text-left px-3 py-3 text-black">{l.name}</td>
                    <td className="text-left px-3 py-3 font-bold text-black">{l.score}</td>
                    <td className="text-left px-3 py-3 text-black">{l.totalAccuracy ? `${Math.round(l.totalAccuracy / (l.guessCount || 1) * 100)}%` : 'N/A'}</td>
                    <td className="text-left px-3 py-3 text-black">{l.guessCount || 0}</td>
                  </tr>
                ))}
                {leaders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 text-center text-gray-500">No entries yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
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
        </div>
      </div>
    </div>
  )
}




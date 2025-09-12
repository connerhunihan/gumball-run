import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function loadLeaders() {
  try {
    return JSON.parse(localStorage.getItem('leaders') || '[]')
  } catch {
    return []
  }
}

function saveLeaders(items) {
  localStorage.setItem('leaders', JSON.stringify(items))
}

export default function Leaderboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { team1Players, team2Players, scores, roomId, stats } = location.state || {}
  
  const [leaders, setLeaders] = useState([])
  const teamsAddedRef = useRef(false)

  useEffect(() => {
    saveLeaders(leaders)
  }, [leaders])

  // Add current teams to leaderboard if they have scores
  useEffect(() => {
    if (scores && (scores.team1 > 0 || scores.team2 > 0) && !teamsAddedRef.current) {
      const newLeaders = []
      
      // Add team 1 (Guestimators) - Manual
      if (scores.team1 > 0) {
        const team1PlayerNames = team1Players?.map(p => p.name).filter(Boolean).join(', ') || 'Guestimators'
        newLeaders.push({
          id: crypto.randomUUID(),
          name: team1PlayerNames,
          playerType: 'Manual',
          region: 'Game',
          score: scores.team1,
          accuracy: stats?.team1?.totalAccuracy || 0,
          guessCount: stats?.team1?.guessCount || 0,
          at: Date.now()
        })
      }
      
      // Add team 2 (Quote Warriors) - AI
      if (scores.team2 > 0) {
        const team2PlayerNames = team2Players?.map(p => p.name).filter(Boolean).join(', ') || 'Quote Warriors'
        newLeaders.push({
          id: crypto.randomUUID(),
          name: team2PlayerNames,
          playerType: 'AI',
          region: 'Game',
          score: scores.team2,
          accuracy: stats?.team2?.totalAccuracy || 0,
          guessCount: stats?.team2?.guessCount || 0,
          at: Date.now()
        })
      }
      
      if (newLeaders.length > 0) {
        setLeaders(prev => {
          const combined = [...prev, ...newLeaders]
          return combined.sort((a,b) => b.score - a.score).slice(0, 50)
        })
        teamsAddedRef.current = true
      }
    }
  }, [scores, team1Players, team2Players])

  const handlePlayAgain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-black font-black text-5xl mb-8 text-center" style={{
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-4.48px',
          lineHeight: '89.6px'
        }}>
          HIGH SCORES
        </h1>

        {/* Leaderboard Table */}
        <div 
          className="bg-white border-4 border-black p-6 mx-auto"
          style={{
            borderRadius: '32px',
            boxShadow: '4px 4px 0px 0px #000000',
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
                  <th className="text-left px-3 py-3 font-bold text-black">Names</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Type</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Score</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Accuracy</th>
                  <th className="text-left px-3 py-3 font-bold text-black">Guesses</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((l, i) => (
                  <tr key={l.id} className="border-b border-gray-300">
                    <td className="px-3 py-3 font-bold text-black">{i + 1}</td>
                    <td className="px-3 py-3 text-black">{l.name}</td>
                    <td className="px-3 py-3 text-black">{l.playerType}</td>
                    <td className="px-3 py-3 font-bold text-black">{l.score}</td>
                    <td className="px-3 py-3 text-black">{l.accuracy ? `${Math.round(l.accuracy * 100)}%` : 'N/A'}</td>
                    <td className="px-3 py-3 text-black">{l.guessCount || 0}</td>
                  </tr>
                ))}
                {leaders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-6 text-center text-gray-500">No entries yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
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




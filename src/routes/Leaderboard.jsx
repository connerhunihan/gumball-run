import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

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
  const { team1Players, team2Players, scores } = location.state || {}
  
  const [leaders, setLeaders] = useState(() => loadLeaders())
  const [name, setName] = useState('')
  const [playerType, setPlayerType] = useState('Human')
  const [region, setRegion] = useState('')
  const [score, setScore] = useState('')

  useEffect(() => {
    saveLeaders(leaders)
  }, [leaders])

  // Add current teams to leaderboard if they have scores
  useEffect(() => {
    if (scores && (scores.team1 > 0 || scores.team2 > 0)) {
      const newLeaders = []
      
      if (scores.team1 > 0) {
        newLeaders.push({
          id: crypto.randomUUID(),
          name: 'Guestimators',
          playerType: 'Team',
          region: 'Game',
          score: scores.team1,
          at: Date.now()
        })
      }
      
      if (scores.team2 > 0) {
        newLeaders.push({
          id: crypto.randomUUID(),
          name: 'Quote Warriors',
          playerType: 'Team',
          region: 'Game',
          score: scores.team2,
          at: Date.now()
        })
      }
      
      if (newLeaders.length > 0) {
        setLeaders(prev => {
          const combined = [...prev, ...newLeaders]
          return combined.sort((a,b) => b.score - a.score).slice(0, 50)
        })
      }
    }
  }, [scores])

  const addLeader = () => {
    const s = Number(score)
    if (!name || !region || !Number.isFinite(s) || s <= 0) return
    const item = { id: crypto.randomUUID(), name, playerType, region, score: s, at: Date.now() }
    setLeaders(prev => [...prev, item].sort((a,b) => b.score - a.score).slice(0, 50))
    setName('')
    setRegion('')
    setScore('')
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div 
              className="bg-white border-4 border-black p-6"
              style={{
                borderRadius: '32px',
                boxShadow: '4px 4px 0px 0px #000000'
              }}
            >
              <h2 className="font-black text-2xl mb-6 text-black" style={{
                fontFamily: 'Lexend Exa, sans-serif'
              }}>
                Leaderboard
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left px-3 py-3 font-bold text-black">Rank</th>
                      <th className="text-left px-3 py-3 font-bold text-black">Name</th>
                      <th className="text-left px-3 py-3 font-bold text-black">Type</th>
                      <th className="text-left px-3 py-3 font-bold text-black">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((l, i) => (
                      <tr key={l.id} className="border-b border-gray-300">
                        <td className="px-3 py-3 font-bold text-black">{i + 1}</td>
                        <td className="px-3 py-3 text-black">{l.name}</td>
                        <td className="px-3 py-3 text-black">{l.playerType}</td>
                        <td className="px-3 py-3 font-bold text-black">{l.score}</td>
                      </tr>
                    ))}
                    {leaders.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-3 py-6 text-center text-gray-500">No entries yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside>
            <div 
              className="bg-[#ffff00] border-4 border-black p-6 space-y-4"
              style={{
                borderRadius: '32px',
                boxShadow: '4px 4px 0px 0px #000000'
              }}
            >
              <h3 className="font-black text-xl text-black" style={{
                fontFamily: 'Lexend Exa, sans-serif'
              }}>
                Submit Winner
              </h3>
              <div>
                <label className="text-sm font-bold text-black">Team / Name</label>
                <input
                  className="mt-1 w-full bg-white border-2 border-black px-3 py-2 outline-none"
                  style={{ borderRadius: '8px' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Team Alpha"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-black">Player Type</label>
                <select
                  className="mt-1 w-full bg-white border-2 border-black px-3 py-2 outline-none"
                  style={{ borderRadius: '8px' }}
                  value={playerType}
                  onChange={e => setPlayerType(e.target.value)}
                >
                  <option>Human</option>
                  <option>Assisted</option>
                  <option>AI</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-black">Region</label>
                <input
                  className="mt-1 w-full bg-white border-2 border-black px-3 py-2 outline-none"
                  style={{ borderRadius: '8px' }}
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  placeholder="e.g., NA-East"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-black">Score</label>
                <input
                  type="number"
                  className="mt-1 w-full bg-white border-2 border-black px-3 py-2 outline-none"
                  style={{ borderRadius: '8px' }}
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  min={1}
                />
              </div>
              <button
                className="w-full bg-black text-white px-4 py-3 font-bold transition-transform hover:scale-105"
                style={{
                  borderRadius: '16px',
                  fontFamily: 'Lexend Exa, sans-serif'
                }}
                onClick={addLeader}
              >
                Add to Leaderboard
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}




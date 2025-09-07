import { useEffect, useState } from 'react'

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
  const [leaders, setLeaders] = useState(() => loadLeaders())
  const [name, setName] = useState('')
  const [playerType, setPlayerType] = useState('Human')
  const [region, setRegion] = useState('')
  const [score, setScore] = useState('')

  useEffect(() => {
    saveLeaders(leaders)
  }, [leaders])

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="font-semibold mb-4">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left px-3 py-2">Rank</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Player Type</th>
                  <th className="text-left px-3 py-2">Region</th>
                  <th className="text-left px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((l, i) => (
                  <tr key={l.id} className="odd:bg-slate-800/30">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{l.name}</td>
                    <td className="px-3 py-2">{l.playerType}</td>
                    <td className="px-3 py-2">{l.region}</td>
                    <td className="px-3 py-2 font-mono">{l.score}</td>
                  </tr>
                ))}
                {leaders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 text-center text-slate-400">No entries yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
          <h3 className="font-semibold">Submit Winner</h3>
          <div>
            <label className="text-xs text-slate-400">Team / Name</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-pink-500"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Team Alpha"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Player Type</label>
            <select
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-pink-500"
              value={playerType}
              onChange={e => setPlayerType(e.target.value)}
            >
              <option>Human</option>
              <option>Assisted</option>
              <option>AI</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Region (tag)</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-pink-500"
              value={region}
              onChange={e => setRegion(e.target.value)}
              placeholder="e.g., NA-East"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Score</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-pink-500"
              value={score}
              onChange={e => setScore(e.target.value)}
              min={1}
            />
          </div>
          <button
            className="w-full rounded-md bg-pink-500 text-white px-3 py-2 transition hover:bg-pink-400 active:translate-y-px"
            onClick={addLeader}
          >
            Add to Leaderboard
          </button>
        </div>
      </aside>
    </div>
  )
}




import { useMemo, useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateGumballs, randomInt, scoreForGuess } from '../lib/gumballs'
import GumballMachine from '../components/GumballMachine'
import Timer from '../components/Timer'

export default function Game() {
  const location = useLocation()
  const navigate = useNavigate()
  const { team, players, currentRound = 1, currentGuess = 1 } = location.state || {}
  
  const [round, setRound] = useState(currentRound)
  const [guess, setGuess] = useState(currentGuess)
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [teamAGuess, setTeamAGuess] = useState('')
  const [teamBGuess, setTeamBGuess] = useState('')
  const [teamBHint, setTeamBHint] = useState(null)
  const [timeLeft, setTimeLeft] = useState(180)
  const [phase, setPhase] = useState('guess')
  const timerRef = useRef(null)

  const machine = useMemo(() => generateGumballs(), [round])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    const trueCount = machine.count
    const noise = randomInt(-Math.floor(trueCount * 0.15), Math.floor(trueCount * 0.15))
    const estimate = Math.max(1, trueCount + noise)
    const confidence = Math.max(5, 100 - Math.abs(noise))
    setTeamBHint({ estimate, confidence })
  }, [round])

  // Timer effect
  useEffect(() => {
    if (phase === 'guess') {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPhase('end')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [phase])

  const submitGuesses = () => {
    const trueCount = machine.count
    const a = Number(teamAGuess)
    const b = Number(teamBGuess)
    if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(b) || b <= 0) return
    const aScore = scoreForGuess(trueCount, a)
    const bScore = scoreForGuess(trueCount, b)
    setTeamAScore(s => s + aScore)
    setTeamBScore(s => s + bScore)
    setPhase('reveal')
  }

  const nextRound = () => {
    if (round >= 2) {
      // Game finished, go to final score
      navigate('/final-score', { 
        state: { 
          team, 
          players, 
          scores: { team1: teamAScore, team2: teamBScore } 
        } 
      })
    } else {
      setRound(r => r + 1)
      setTeamAGuess('')
      setTeamBGuess('')
      setPhase('guess')
      setTimeLeft(180) // Reset timer for next round
    }
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Team 1 Panel */}
        <div className="flex-1">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            {/* Timer */}
            <div className="h-16 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-black font-light text-2xl tracking-widest">
                {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
              </span>
            </div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball machine */}
              <div className="w-64 h-56 mx-auto mb-6 flex items-center justify-center">
                <GumballMachine balls={machine.balls} count={machine.count} />
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Guestimators
                </h2>
              </div>
            </div>
            
            {/* Guess input */}
            <div className="bg-white border-4 border-black rounded-3xl p-6">
              <input
                type="number"
                placeholder="enter a number"
                value={teamAGuess}
                onChange={e => setTeamAGuess(e.target.value)}
                disabled={phase !== 'guess'}
                className="w-full text-center text-3xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
                style={{ fontFamily: 'Lexend Exa, sans-serif' }}
                min={1}
              />
            </div>
          </div>
        </div>

        {/* Team 2 Panel */}
        <div className="flex-1">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            {/* Timer */}
            <div className="h-16 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-black font-light text-2xl tracking-widest">
                {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
              </span>
            </div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball machine */}
              <div className="w-64 h-56 mx-auto mb-6 flex items-center justify-center">
                <GumballMachine balls={machine.balls} count={machine.count} />
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Quote warriors
                </h2>
              </div>
            </div>
            
            {/* Guess input */}
            <div className="bg-white border-4 border-black rounded-3xl p-6">
              <input
                type="number"
                placeholder="enter a number"
                value={teamBGuess}
                onChange={e => setTeamBGuess(e.target.value)}
                disabled={phase !== 'guess'}
                className="w-full text-center text-3xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
                style={{ fontFamily: 'Lexend Exa, sans-serif' }}
                min={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {phase === 'guess' && (
          <button
            onClick={submitGuesses}
            disabled={!teamAGuess || !teamBGuess}
            className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
            style={{ 
              fontFamily: 'Lexend Exa, sans-serif',
              letterSpacing: '-0.07em'
            }}
          >
            SUBMIT GUESSES
          </button>
        )}
        {phase === 'reveal' && (
          <button
            onClick={nextRound}
            className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ 
              fontFamily: 'Lexend Exa, sans-serif',
              letterSpacing: '-0.07em'
            }}
          >
            {round >= 2 ? 'FINISH GAME' : 'NEXT ROUND'}
          </button>
        )}
      </div>

      {/* Reveal overlay */}
      {phase === 'reveal' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            <h2 className="text-black font-black text-4xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              Round {round} Results
            </h2>
            <p className="text-black font-normal text-2xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              True count: <span className="font-bold">{machine.count}</span>
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#ffff00] border-2 border-black rounded-lg p-4">
                <div className="text-black font-normal text-xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Guestimators: {teamAGuess}
                </div>
              </div>
              <div className="bg-[#ffff00] border-2 border-black rounded-lg p-4">
                <div className="text-black font-normal text-xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Quote warriors: {teamBGuess}
                </div>
              </div>
            </div>
            <button
              onClick={nextRound}
              className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}
            >
              {round >= 2 ? 'FINISH GAME' : 'NEXT ROUND'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



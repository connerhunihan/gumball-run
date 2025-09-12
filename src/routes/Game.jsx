import { useMemo, useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateGumballs, randomInt, scoreForGuess } from '../lib/gumballs'
import GumballMachine from '../components/GumballMachine'
import TimerDisplay from '../components/TimerDisplay'
import StarScore from '../components/StarScore'
import TeamStats from '../components/TeamStats'

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
  const [timeLeft, setTimeLeft] = useState(30)
  const [phase, setPhase] = useState('guess')
  const timerRef = useRef(null)
  const timeLeftRef = useRef(30)
  
  // Track team stats
  const [teamAStats, setTeamAStats] = useState({ guessCount: 0, totalAccuracy: 0 })
  const [teamBStats, setTeamBStats] = useState({ guessCount: 0, totalAccuracy: 0 })

  const machine = useMemo(() => generateGumballs(), [round])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const trueCount = machine.count
    const noise = randomInt(-Math.floor(trueCount * 0.15), Math.floor(trueCount * 0.15))
    const estimate = Math.max(1, trueCount + noise)
    const confidence = Math.max(5, 100 - Math.abs(noise))
    setTeamBHint({ estimate, confidence })
  }, [round])

  // Timer effect - completely independent countdown
  useEffect(() => {
    if (phase === 'guess') {
      console.log('Starting timer, timeLeft:', timeLeft)
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      // Start new timer that runs independently
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1
          console.log('Timer tick, prev:', prev, 'new:', newTime)
          
          if (newTime <= 0) {
            console.log('Timer ended, setting phase to end')
            // Use setTimeout to avoid state update during render
            setTimeout(() => setPhase('end'), 0)
            return 0
          }
          return newTime
        })
      }, 1000)
      
      return () => {
        if (timerRef.current) {
          console.log('Clearing timer interval')
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    } else {
      // Clear any existing interval when not in guess phase
      if (timerRef.current) {
        console.log('Clearing timer interval (not in guess phase)')
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [phase])

  const submitGuesses = () => {
    const trueCount = machine.count
    const a = Number(teamAGuess)
    const b = Number(teamBGuess)
    if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(b) || b <= 0) return
    const aScore = scoreForGuess(trueCount, a)
    const bScore = scoreForGuess(trueCount, b)
    
    // Calculate accuracy (0-1 scale, closer to 1 is better)
    const aAccuracy = 1 - Math.abs(a - trueCount) / trueCount
    const bAccuracy = 1 - Math.abs(b - trueCount) / trueCount
    
    // Update scores
    setTeamAScore(s => s + aScore)
    setTeamBScore(s => s + bScore)
    
    // Update stats
    setTeamAStats(prev => ({
      guessCount: prev.guessCount + 1,
      totalAccuracy: (prev.totalAccuracy * prev.guessCount + aAccuracy) / (prev.guessCount + 1)
    }))
    setTeamBStats(prev => ({
      guessCount: prev.guessCount + 1,
      totalAccuracy: (prev.totalAccuracy * prev.guessCount + bAccuracy) / (prev.guessCount + 1)
    }))
    
    setPhase('reveal')
  }

  const nextRound = () => {
    if (round >= 2) {
      // Game finished, go to final score
      navigate('/final-score', { 
        state: { 
          team, 
          players, 
          scores: { team1: teamAScore, team2: teamBScore },
          stats: {
            team1: teamAStats,
            team2: teamBStats
          }
        } 
      })
    } else {
      setRound(r => r + 1)
      setTeamAGuess('')
      setTeamBGuess('')
      setPhase('guess')
      setTimeLeft(30) // Reset timer for next round
      timeLeftRef.current = 30 // Reset ref as well
    }
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Team 1 Panel */}
        <div className="flex-1">
          <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
            {/* Timer */}
            <div className="mb-4 flex justify-center">
              <TimerDisplay timeLeft={timeLeft} />
            </div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball machine */}
              <div className="w-64 h-56 mx-auto mb-6 flex items-center justify-center">
                <GumballMachine balls={machine.balls} count={machine.count} />
              </div>
              
              {/* Team name and stats */}
              <div className="text-center space-y-4">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Guestimators
                </h2>
                <TeamStats 
                  accuracy={teamAStats.totalAccuracy} 
                  guessCount={teamAStats.guessCount}
                />
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
            <div className="mb-4 flex justify-center">
              <TimerDisplay timeLeft={timeLeft} />
            </div>
            
            {/* Main area */}
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 mb-6">
              {/* Gumball machine */}
              <div className="w-64 h-56 mx-auto mb-6 flex items-center justify-center">
                <GumballMachine balls={machine.balls} count={machine.count} />
              </div>
              
              {/* Team name and stats */}
              <div className="text-center space-y-4">
                <h2 className="text-black font-normal text-3xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  Quote warriors
                </h2>
                <TeamStats 
                  accuracy={teamBStats.totalAccuracy} 
                  guessCount={teamBStats.guessCount}
                />
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



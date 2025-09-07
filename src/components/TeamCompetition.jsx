import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GumballMachine from './GumballMachine'
import { generateGumballs, scoreForGuess } from '../lib/gumballs'

export default function TeamCompetition() {
  const navigate = useNavigate()
  const location = useLocation()
  const { team1Players, team2Players, currentTeam, round, team1Score, team2Score } = location.state || {}
  
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [phase, setPhase] = useState('guess') // 'guess' or 'reveal'
  const [machine, setMachine] = useState(() => generateGumballs())
  const [currentGuess, setCurrentGuess] = useState('')
  const [currentRound, setCurrentRound] = useState(round || 1)
  const [teamAScore, setTeamAScore] = useState(team1Score || 0)
  const [teamBScore, setTeamBScore] = useState(team2Score || 0)

  // Reset state when team changes
  useEffect(() => {
    setCurrentGuess('')
    setPhase('guess')
    setTimeLeft(180)
    setMachine(generateGumballs())
  }, [currentTeam])

  // Timer effect
  useEffect(() => {
    if (phase === 'guess') {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPhase('reveal')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [phase])

  const submitGuess = () => {
    if (currentGuess.trim()) {
      setPhase('reveal')
    }
  }

  const nextRound = () => {
    if (currentRound >= 2) {
      // Game finished, go to final score
      navigate('/final-score', { 
        state: { 
          team1Players,
          team2Players,
          scores: { team1: teamAScore, team2: teamBScore } 
        } 
      })
    } else {
      // Switch to other team for next round
      const nextTeam = currentTeam === 'team1' ? 'team2' : 'team1'
      navigate('/team-competition', { 
        state: { 
          team1Players,
          team2Players,
          currentTeam: nextTeam,
          round: currentRound + 1,
          team1Score: teamAScore,
          team2Score: teamBScore
        } 
      })
    }
  }

  const currentTeamName = currentTeam === 'team1' ? 'Guestimators' : 'Quote warriors'
  const currentTeamPlayers = currentTeam === 'team1' ? team1Players : team2Players

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Timer */}
        <div className="bg-white border-4 border-black rounded-2xl p-8 mb-8">
          <div className="h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
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
                {currentTeamName}
              </h2>
            </div>
          </div>
          
          {/* Guess input */}
          <div className="bg-white border-4 border-black rounded-3xl p-6">
            <input
              type="number"
              placeholder="enter a number"
              value={currentGuess}
              onChange={e => setCurrentGuess(e.target.value)}
              disabled={phase !== 'guess'}
              className="w-full text-center text-3xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
              style={{ fontFamily: 'Lexend Exa, sans-serif' }}
              min={1}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          {phase === 'guess' && (
            <button
              onClick={submitGuess}
              disabled={!currentGuess}
              className="bg-white border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
              style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}
            >
              SUBMIT GUESS
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
              {currentRound >= 2 ? 'FINISH GAME' : 'NEXT ROUND'}
            </button>
          )}
        </div>

        {/* Reveal overlay */}
        {phase === 'reveal' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white border-4 border-black rounded-2xl p-8 text-center">
              <h2 className="text-black font-black text-4xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                Round {currentRound} Results
              </h2>
              <p className="text-black font-normal text-2xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                True count: <span className="font-bold">{machine.count}</span>
              </p>
              <div className="bg-[#ffff00] border-2 border-black rounded-lg p-4 mb-6">
                <div className="text-black font-normal text-xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  {currentTeamName}: {currentGuess}
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
                {currentRound >= 2 ? 'FINISH GAME' : 'NEXT ROUND'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

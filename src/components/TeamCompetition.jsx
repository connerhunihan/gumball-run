import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GumballMachine from './GumballMachine'
import ScoreCounter from './ScoreCounter.jsx'
import { subscribeToRoom, subscribeToScores, submitGuess, isGameActive, getRemainingTime } from '../lib/room.js'

export default function TeamCompetition() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, team1Players, team2Players, playerTeam, playerId } = location.state || {}
  
  const [roomData, setRoomData] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastGuessResult, setLastGuessResult] = useState(null)
  const [showGuessResult, setShowGuessResult] = useState(false)

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
      
      // Check if game is over
      if (!isGameActive(data)) {
        navigate('/final-score', { 
          state: { 
            roomId,
            team1Players,
            team2Players,
            scores: { 
              team1: data?.teams?.team1?.score || 0, 
              team2: data?.teams?.team2?.score || 0 
            } 
          } 
        })
      }
    })

    return () => unsubscribe()
  }, [roomId, navigate, team1Players, team2Players])

  // Handle guess submission (only for Quote warriors - team2)
  const handleSubmitGuess = async (e) => {
    if (e.key === 'Enter' && currentGuess.trim() && !isSubmitting && playerTeam === 'team2') {
      setIsSubmitting(true)
      
      try {
        const result = await submitGuess(roomId, playerId, currentGuess)
        setLastGuessResult(result)
        setShowGuessResult(true)
        setCurrentGuess('')
        
        // Hide result after 2 seconds
        setTimeout(() => {
          setShowGuessResult(false)
          setIsSubmitting(false)
        }, 2000)
      } catch (error) {
        console.error('Error submitting guess:', error)
        setIsSubmitting(false)
      }
    }
  }

  if (!roomData) {
    return (
      <div className="h-screen bg-[#8eebff] flex items-center justify-center">
        <div className="text-black text-2xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Loading game...
        </div>
      </div>
    )
  }

  const remainingTime = getRemainingTime(roomData)
  const currentMachine = roomData.state?.currentMachine
  const team1Score = roomData.teams?.team1?.score || 0
  const team2Score = roomData.teams?.team2?.score || 0

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Left side - Score counter for Team 1 (Guestimators) */}
        <div className="flex flex-col items-center">
          <ScoreCounter score={team1Score} teamName="Guestimators" />
        </div>

        {/* Center - Game panel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-[400px]">
            <div className="text-center relative">
              {/* Timer - right aligned per Figma */}
              <div className="h-[40px] mb-2">
                <div className="float-right bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-black font-extralight tracking-[0.22em]" style={{
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '18px',
                    lineHeight: '25px'
                  }}>
                    {String(Math.floor(remainingTime/60)).padStart(1,'0')}:{String(remainingTime%60).padStart(2,'0')}
                  </span>
                </div>
              </div>
              
              {/* Main area */}
              <div 
                className="bg-[#ffff00] border-4 border-black p-4 mb-4"
                style={{
                  borderRadius: '32px',
                  boxShadow: '4px 4px 0px 0px #000000',
                  height: '300px',
                  width: '400px'
                }}
              >
                {/* Gumball machine */}
                <div className="w-full h-48 mx-auto mb-4 flex items-center justify-center">
                  {currentMachine && (
                    <GumballMachine balls={currentMachine.balls} count={currentMachine.count} />
                  )}
                </div>
                
                {/* Team name */}
                <div className="text-center">
                  <h2 className="text-black font-normal text-xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                    {playerTeam === 'team1' ? 'Guestimators' : 'Quote warriors'}
                  </h2>
                  <p className="text-black font-light text-sm">
                    {playerTeam === 'team1' ? team1Players.join(', ') : team2Players.join(', ')}
                  </p>
                </div>
              </div>
              
              {/* Guess input - only show for Quote warriors (team2) */}
              {playerTeam === 'team2' && (
                <div 
                  className="bg-white border-4 border-black p-4"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '4px 4px 0px 0px #000000',
                    height: '80px',
                    width: '400px'
                  }}
                >
                  <input
                    type="number"
                    placeholder="enter a number"
                    value={currentGuess}
                    onChange={e => setCurrentGuess(e.target.value)}
                    onKeyPress={handleSubmitGuess}
                    disabled={isSubmitting}
                    className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
                    style={{ fontFamily: 'Lexend Exa, sans-serif' }}
                    min={1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Guess result display */}
          {showGuessResult && lastGuessResult && (
            <div className="mt-4 text-center">
              <div 
                className="bg-white border-4 border-black p-4"
                style={{ 
                  borderRadius: '12px', 
                  boxShadow: '4px 4px 0px 0px #000',
                  width: '400px'
                }}
              >
                <div className="text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                  <div className="text-lg font-bold">+{lastGuessResult.score} points!</div>
                  <div className="text-sm">Actual: {lastGuessResult.actualCount}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Score counter for Team 2 (Quote warriors) */}
        <div className="flex flex-col items-center">
          <ScoreCounter score={team2Score} teamName="Quote warriors" />
        </div>
      </div>
    </div>
  )
}
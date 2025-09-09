import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GumballMachine from './GumballMachine'
import StarScore from './StarScore.jsx'
import EstimateComponent from './EstimateComponent.jsx'
import GumballImage from './GumballImage.jsx'
import { subscribeToRoom, subscribeToScores, submitGuess, isGameActive, getRemainingTime } from '../lib/room.js'

export default function TeamCompetition() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, team1Players, team2Players, playerTeam, playerId } = location.state || {}
  
  // Debug logging
  console.log('TeamCompetition state:', { roomId, team1Players, team2Players, playerTeam, playerId })
  
  const [roomData, setRoomData] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastGuessResult, setLastGuessResult] = useState(null)
  const [showGuessResult, setShowGuessResult] = useState(false)
  const [gumballCount, setGumballCount] = useState(50)
  const [imageKey, setImageKey] = useState(0)

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
      
      // Update gumball count when machine changes
      const machine = data?.state?.[`${playerTeam}Machine`] || data?.state?.currentMachine
      if (machine?.count) {
        setGumballCount(machine.count)
      }
      
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
  }, [roomId, navigate, team1Players, team2Players, playerTeam])

  // Handle guess submission (for both teams)

  const handleSubmitGuess = async (number, confidence = 'Medium') => {
    if (number.trim() && !isSubmitting) {
      setIsSubmitting(true)
      
      try {
        const result = await submitGuess(roomId, playerId, number, playerTeam)
        setLastGuessResult(result)
        setShowGuessResult(true)
        setCurrentGuess('')
        
        // Refresh gumball image after guess submission
        setImageKey(prev => prev + 1)
        
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
          <br />
          <div className="text-sm mt-4">
            Debug: playerTeam = "{playerTeam}", roomId = "{roomId}"
          </div>
        </div>
      </div>
    )
  }

  const remainingTime = getRemainingTime(roomData)
  const currentMachine = roomData.state?.[`${playerTeam}Machine`] || roomData.state?.currentMachine
  const team1Score = roomData.teams?.team1?.score || 0
  const team2Score = roomData.teams?.team2?.score || 0

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Left side - Star score for Team 1 (Guestimators) */}
        <StarScore score={team1Score} teamName="Guestimators" isLeft={true} />

        {/* Center - Game panel */}
        <div className="flex-1 flex flex-col items-center relative">
          <div className="w-[400px]">
            <div className="text-center relative">
              {/* Timer - right aligned per Figma */}
              <div className="h-[40px] mb-2">
                <div className="float-right bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold tracking-[0.22em]" style={{
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '25px'
                  }}>
                    {String(Math.floor(remainingTime/60)).padStart(1,'0')}:{String(remainingTime%60).padStart(2,'0')}
                  </span>
                </div>
              </div>
              
              {/* Main area */}
              <div 
                className="bg-[#ffff00] border-4 border-black p-4 mb-4 relative overflow-hidden"
                style={{
                  borderRadius: '32px',
                  boxShadow: '4px 4px 0px 0px #000000',
                  height: '300px',
                  width: '400px'
                }}
              >
                {/* 2D Gumball Image */}
                <div className="absolute inset-0">
                  <GumballImage
                    key={imageKey}
                    count={gumballCount}
                    width={400}
                    height={300}
                  />
                </div>
                
                {/* Content overlay */}
                <div className="relative z-10 h-full flex flex-col justify-center">
                  {/* Estimate component - only show for Quote warriors (team2) */}
                  {playerTeam === 'team2' && (
                    <EstimateComponent 
                      onSubmitGuess={handleSubmitGuess}
                      isSubmitting={isSubmitting}
                      actualCount={currentMachine?.count}
                      particleCount={gumballCount}
                    />
                  )}
                </div>
              </div>
              
              {/* Guess input - show for both teams */}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentGuess.trim() && !isSubmitting) {
                      handleSubmitGuess(currentGuess, 'Medium')
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
                  style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Guess result display - positioned absolutely to not affect layout */}
          {showGuessResult && lastGuessResult && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center z-10">
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

        {/* Right side - Star score for Team 2 (Quote warriors) */}
        <StarScore score={team2Score} teamName="Quote warriors" isLeft={false} />
      </div>
    </div>
  )
}
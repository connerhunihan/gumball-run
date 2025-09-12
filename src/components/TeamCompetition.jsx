import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GumballMachine from './GumballMachine'
import StarScore from './StarScore.jsx'
import EstimateComponent from './EstimateComponent.jsx'
import GumballImage from './GumballImage.jsx'
import TimerDisplay from './TimerDisplay.jsx'
import TeamStats from './TeamStats.jsx'
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
  const [teammateNotifications, setTeammateNotifications] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [team1Stats, setTeam1Stats] = useState({ guessCount: 0, totalAccuracy: 0 })
  const [team2Stats, setTeam2Stats] = useState({ guessCount: 0, totalAccuracy: 0 })

  // Calculate team stats whenever room data changes
  useEffect(() => {
    if (roomData?.teams) {
      const team1Players = Object.values(roomData.teams.team1?.players || {})
      const team2Players = Object.values(roomData.teams.team2?.players || {})
      
      const team1GuessCount = team1Players.reduce((total, p) => total + (p.guessCount || 0), 0)
      const team1Accuracy = team1Players.length > 0 
        ? team1Players.reduce((total, p) => {
            const playerAccuracy = (p.guessCount || 0) > 0 ? (p.totalAccuracy || 0) / (p.guessCount || 1) : 0
            return total + playerAccuracy
          }, 0) / team1Players.length
        : 0
      
      const team2GuessCount = team2Players.reduce((total, p) => total + (p.guessCount || 0), 0)
      const team2Accuracy = team2Players.length > 0 
        ? team2Players.reduce((total, p) => {
            const playerAccuracy = (p.guessCount || 0) > 0 ? (p.totalAccuracy || 0) / (p.guessCount || 1) : 0
            return total + playerAccuracy
          }, 0) / team2Players.length
        : 0
      
      // Debug logging
      console.log('Team stats calculation:', {
        team1: {
          players: team1Players.map(p => ({ 
            name: p.name, 
            guessCount: p.guessCount, 
            totalAccuracy: p.totalAccuracy,
            avgAccuracy: p.guessCount > 0 ? (p.totalAccuracy / p.guessCount * 100).toFixed(1) + '%' : '0%'
          })),
          teamGuessCount: team1GuessCount,
          teamAccuracy: (team1Accuracy * 100).toFixed(1) + '%'
        },
        team2: {
          players: team2Players.map(p => ({ 
            name: p.name, 
            guessCount: p.guessCount, 
            totalAccuracy: p.totalAccuracy,
            avgAccuracy: p.guessCount > 0 ? (p.totalAccuracy / p.guessCount * 100).toFixed(1) + '%' : '0%'
          })),
          teamGuessCount: team2GuessCount,
          teamAccuracy: (team2Accuracy * 100).toFixed(1) + '%'
        }
      })
      
      const newTeam1Stats = {
        guessCount: team1GuessCount,
        totalAccuracy: team1Accuracy
      }
      
      const newTeam2Stats = {
        guessCount: team2GuessCount,
        totalAccuracy: team2Accuracy
      }
      
      setTeam1Stats(newTeam1Stats)
      setTeam2Stats(newTeam2Stats)
    }
  }, [roomData])

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
      
      // Check if game has started
      if (data?.state?.gameStarted && !gameStarted) {
        console.log('Game started!')
        setGameStarted(true)
      }
      
      // Get this player's individual machine
      const playerData = data?.teams?.[playerTeam]?.players?.[playerId]
      if (playerData?.currentMachine?.count) {
        setGumballCount(playerData.currentMachine.count)
      }
      
      // Listen for new guesses from teammates
      if (data?.guesses) {
        const recentGuesses = Object.values(data.guesses)
          .filter(guess => 
            guess.teamId === playerTeam && 
            guess.playerId !== playerId && 
            Date.now() - guess.timestamp < 5000 // Last 5 seconds
          )
          .sort((a, b) => b.timestamp - a.timestamp)
        
        // Show notifications for recent teammate scores
        recentGuesses.forEach(guess => {
          const notification = {
            id: guess.timestamp,
            playerName: guess.playerName,
            score: guess.score
          }
          setTeammateNotifications(prev => {
            if (!prev.find(n => n.id === notification.id)) {
              return [...prev, notification]
            }
            return prev
          })
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            setTeammateNotifications(prev => prev.filter(n => n.id !== notification.id))
          }, 3000)
        })
      }
      
      // Check if game is over (only if game has started and time is up)
      if (data?.state?.gameStarted && !isGameActive(data)) {
        console.log('Game ended, navigating to final score')
        // Calculate team stats
        const team1Players = Object.values(data?.teams?.team1?.players || {})
        const team2Players = Object.values(data?.teams?.team2?.players || {})
        
        const team1Stats = {
          guessCount: team1Players.reduce((total, p) => total + (p.guessCount || 0), 0),
          totalAccuracy: team1Players.length > 0 
            ? team1Players.reduce((total, p) => {
                const playerAccuracy = (p.guessCount || 0) > 0 ? (p.totalAccuracy || 0) / (p.guessCount || 1) : 0
                return total + playerAccuracy
              }, 0) / team1Players.length
            : 0
        }
        
        const team2Stats = {
          guessCount: team2Players.reduce((total, p) => total + (p.guessCount || 0), 0),
          totalAccuracy: team2Players.length > 0 
            ? team2Players.reduce((total, p) => {
                const playerAccuracy = (p.guessCount || 0) > 0 ? (p.totalAccuracy || 0) / (p.guessCount || 1) : 0
                return total + playerAccuracy
              }, 0) / team2Players.length
            : 0
        }
        
        navigate('/final-score', { 
          state: { 
            roomId,
            team1Players,
            team2Players,
            scores: { 
              team1: data?.teams?.team1?.score || 0, 
              team2: data?.teams?.team2?.score || 0 
            },
            stats: {
              team1: team1Stats,
              team2: team2Stats
            },
            fromHomepage: location.state?.fromHomepage || false
          } 
        })
      }
    })

    return () => unsubscribe()
  }, [roomId, navigate, team1Players, team2Players, playerTeam])

  // Simple timer implementation
  useEffect(() => {
    if (!gameStarted) return

    console.log('Starting game timer')
    const startTime = Date.now()
    const duration = 3 * 60 * 1000 // 3 minutes

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000))
      
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(timer)
        console.log('Timer ended!')
      }
    }, 100) // Update every 100ms

    return () => clearInterval(timer)
  }, [gameStarted])

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
  const team1Score = roomData.teams?.team1?.score || 0
  const team2Score = roomData.teams?.team2?.score || 0

  // Handle timer completion
  const handleTimeUp = () => {
    console.log('Time up! Game ended.')
    // The game end logic will be handled by the room subscription
  }

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Left side - Star score for Team 1 (Guestimators) */}
        <StarScore score={team1Score} teamName="Guestimators" isLeft={true} teamStats={team1Stats} />

        {/* Center - Game panel */}
        <div className="flex-1 flex flex-col items-center relative">
          <div className="w-[400px]">
            <div className="text-center relative">
              {/* Timer - right aligned per Figma */}
              <div className="h-[40px] mb-8">
                <div className="float-right">
                  <TimerDisplay timeLeft={timeLeft} />
                </div>
              </div>
              
              {/* Main area */}
              <div 
                className="bg-[#ffff00] border-4 border-black p-4 mb-4 relative overflow-hidden mt-8"
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
                <div className="relative z-10 h-full">
                  {/* Estimate component - only show for Quote warriors (team2) */}
                  {playerTeam === 'team2' && (
                    <div className="absolute bottom-2 right-2">
                      <EstimateComponent 
                        onSubmitGuess={handleSubmitGuess}
                        isSubmitting={isSubmitting}
                        actualCount={gumballCount}
                        particleCount={gumballCount}
                      />
                    </div>
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

          {/* Teammate score notifications */}
          {teammateNotifications.map((notification, index) => (
            <div 
              key={notification.id}
              className="absolute top-4 left-4 z-20 animate-pulse"
              style={{ 
                transform: `translateY(${index * 60}px)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div 
                className="bg-green-500 text-white px-3 py-2 rounded-lg border-2 border-black"
                style={{ 
                  fontFamily: 'Lexend Exa, sans-serif',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '2px 2px 0px 0px #000'
                }}
              >
                {notification.playerName} +{notification.score} points!
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Star score for Team 2 (Quote warriors) */}
        <StarScore score={team2Score} teamName="Quote warriors" isLeft={false} teamStats={team2Stats} />
      </div>
    </div>
  )
}
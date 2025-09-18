import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GumballImage from './GumballImage.jsx'
import TimerDisplay from './TimerDisplay.jsx'
import StarScore from './StarScore.jsx'
import { subscribeToRoom, submitGuess, isGameActive, getRemainingTime, submitHighScore } from '../lib/room.js'
import EstimateComponent from './EstimateComponent.jsx'
import TeamStats from './TeamStats.jsx'

export default function IndividualCompetition() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, players, playerId } = location.state || {}
  
  const [roomData, setRoomData] = useState(null)
  const [currentGuess, setCurrentGuess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastGuessResult, setLastGuessResult] = useState(null)
  const [showGuessResult, setShowGuessResult] = useState(false)
  const [gumballCount, setGumballCount] = useState(50)
  const inputRef = useRef(null)
  const [imageKey, setImageKey] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const [playerStats, setPlayerStats] = useState({ guessCount: 0, totalAccuracy: 0, score: 0 })
  const [leaderboard, setLeaderboard] = useState([])

  // This effect sets up the subscription to the room data
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
    })

    return () => unsubscribe()
  }, [roomId])

  // This effect processes the room data whenever it changes
  useEffect(() => {
    if (!roomData) return

    // Update the timer based on server time
    if (roomData.state?.gameStarted) {
      setTimeLeft(getRemainingTime(roomData))
    }

    // Check if game has started
    if (roomData.state?.gameStarted && !gameStarted) {
      setGameStarted(true)
    }
    
    // Update current player's stats and gumball machine
    const playerData = roomData.players?.[playerId]
    if (playerData) {
      setGumballCount(playerData.currentMachine?.count || 50) // Fallback for safety
      setPlayerStats({
        guessCount: playerData.guessCount || 0,
        totalAccuracy: playerData.totalAccuracy || 0,
        score: playerData.score || 0,
        currentMachine: playerData.currentMachine
      })
    }
    
    // Update leaderboard
    if (roomData.players) {
      const sortedPlayers = Object.values(roomData.players)
        .sort((a, b) => b.score - a.score)
      setLeaderboard(sortedPlayers)
    }
    
    // Navigate to final score when game is over
    if (gameStarted && !isGameActive(roomData)) {
      // Create a stable list of players to pass in state
      const finalPlayers = Object.values(roomData.players).sort((a, b) => b.score - a.score)
      
      // Submit the current player's score to the persistent leaderboard
      const myPlayerData = roomData.players?.[playerId]
      if (myPlayerData) {
        submitHighScore(myPlayerData)
      }

      navigate('/final-score', { 
        state: { 
          roomId,
          players: finalPlayers,
          fromHomepage: location.state?.fromHomepage || false
        } 
      })
    }
  }, [roomData, gameStarted, playerId, navigate, roomId, location.state])


  // This is a client-side interval for display purposes only.
  // The authoritative time comes from `roomData` and the effect above.
  useEffect(() => {
    if (!gameStarted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted])

  // Auto-focus input field when game starts and after each guess
  useEffect(() => {
    if (gameStarted && inputRef.current && !isSubmitting) {
      inputRef.current.focus()
    }
  }, [gameStarted, isSubmitting])

  // Focus input after guess result is shown and hidden
  useEffect(() => {
    if (showGuessResult) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 2100) // Slightly after the 2-second display time
      return () => clearTimeout(timer)
    }
  }, [showGuessResult])

  const handleSubmitGuess = async (guess, confidence) => {
    if (guess.trim() && !isSubmitting) {
      setIsSubmitting(true)
      
      try {
        const result = await submitGuess(roomId, playerId, guess, confidence)
        setLastGuessResult(result)
        setShowGuessResult(true)
        setCurrentGuess('')
        
        setImageKey(prev => prev + 1)
        
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

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      <div className="flex items-center gap-8 max-w-6xl w-full relative">
        <StarScore score={playerStats.score} />

        <div className="flex-1 flex flex-col items-center relative">
          <div className="w-[400px]">
            <div className="text-center relative">
              <div className="h-[40px] mb-2">
              </div>
              
              <div 
                className="bg-[#ffff00] border-4 border-black p-2 mb-2 relative overflow-hidden"
                style={{
                  borderRadius: '32px',
                  boxShadow: '8px 8px 0px 0px #000000',
                  height: '250px',
                  width: '400px'
                }}
              >
                <div className="absolute inset-0">
                  <GumballImage
                    key={imageKey}
                    machine={playerStats.currentMachine}
                    width={400}
                    height={250}
                  />
                </div>
              </div>
              
              {/* Estimate component - positioned outside yellow box with higher z-index */}
              {roomData.players?.[playerId]?.guessingMethod === 'estimate' && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <EstimateComponent 
                    onSubmitGuess={handleSubmitGuess}
                    isSubmitting={isSubmitting}
                    actualCount={gumballCount}
                  />
                </div>
              )}
              
              <div className="w-[400px] mt-2 flex flex-col items-center gap-2">
                {/* Input element - show for ALL users */}
                <div 
                  className="bg-white border-4 border-black p-2 w-full"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '8px 8px 0px 0px #000000',
                    height: '60px',
                  }}
                >
                  <input
                    ref={inputRef}
                    type="number"
                    placeholder="enter a number"
                    value={currentGuess}
                    onChange={e => setCurrentGuess(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitGuess(currentGuess)
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

                <TeamStats 
                  accuracy={playerStats.guessCount > 0 ? playerStats.totalAccuracy / playerStats.guessCount : 0}
                  guessCount={playerStats.guessCount}
                />
              </div>
            </div>
          </div>

          {showGuessResult && lastGuessResult && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center z-10">
              <div 
                className="bg-white border-4 border-black p-4"
                style={{ 
                  borderRadius: '12px', 
                  boxShadow: '8px 8px 0px 0px #000',
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

        <div className="w-[400px] bg-white border-4 border-black rounded-2xl p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div key={player.id || index} className="flex items-center justify-between text-sm">
                <span className="text-left">{index + 1}. {player.name}</span>
                <div className="flex gap-3 text-xs text-left">
                  <span className="w-12">Score: {player.score}</span>
                  <span className="w-12">Acc: {Math.round((player.totalAccuracy || 0) / Math.max(1, player.guessCount || 1) * 100)}%</span>
                  <span className="w-8">G: {player.guessCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Timer positioned to align with leaderboard right edge */}
        <div className="absolute top-0" style={{ right: '0px' }}>
          <TimerDisplay timeLeft={timeLeft} />
        </div>
      </div>
    </div>
  )
}
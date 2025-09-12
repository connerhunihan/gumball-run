import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { subscribeToRoom } from '../lib/room.js'
import GumballImage from './GumballImage.jsx'
import TimerDisplay from './TimerDisplay.jsx'

export default function Tutorial() {
  const location = useLocation()
  const navigate = useNavigate()
  const { team1Players, team2Players, roomId, playerTeam, playerId } = location.state || {}
  
  const [guess, setGuess] = useState('')
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameStarted, setGameStarted] = useState(false)

  // Subscribe to room updates to check if game has started
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (roomData) => {
      console.log('Tutorial: Room data received', {
        gameStarted: roomData?.state?.gameStarted,
        roomId,
        playerTeam
      })
      // Don't navigate immediately - let the timer handle it
      if (roomData?.state?.gameStarted) {
        console.log('Tutorial: Game started, but showing tutorial first')
        setGameStarted(true)
      }
    })

    return () => unsubscribe()
  }, [roomId, playerTeam])

  // Auto-start timer
  useEffect(() => {
    console.log('Tutorial timer starting with timeLeft:', timeLeft)
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        console.log('Tutorial timer tick, prev:', prev)
        if (prev <= 1) {
          console.log('Tutorial timer ended, starting game')
          // Use setTimeout to avoid calling navigate during render
          setTimeout(() => handleStartGame(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleStartGame = () => {
    navigate('/team-competition', { 
      state: { 
        roomId,
        team1Players,
        team2Players,
        playerTeam,
        fromHomepage: location.state?.fromHomepage || false,
        playerId
      } 
    })
  }

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Title - centered */}
      <div className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-black font-black text-5xl" style={{ 
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-4.48px',
          lineHeight: '89.6px'
        }}>
          Here's how it works
        </h1>
      </div>

      <div className="flex gap-8 max-w-5xl w-full justify-center">
        {/* Left panel - Instructions */}
        <div className="flex flex-col items-center" style={{ width: '400px' }}>
          <div className="text-center" style={{ width: '400px' }}>
            {/* Timer area - empty/transparent */}
            <div className="h-[40px] mb-2"></div>
            
            {/* Main area */}
            <div 
              className="bg-[#ffff00] border-4 border-black p-4 mb-4 relative overflow-hidden mt-8"
              style={{
                borderRadius: '32px',
                boxShadow: '8px 8px 0px 0px #000000',
                height: '300px',
                width: '400px'
              }}
            >
              {/* Gumball Image for Guestimators */}
              <div className="absolute inset-0">
                <GumballImage
                  count={75}
                  width={400}
                  height={300}
                />
              </div>
            </div>
            
            {/* Instructions and input */}
            <div className="text-center mb-4">
              <p className="text-black font-normal text-xl mb-2" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '0px'
              }}>
                You make your own guess ...
              </p>
              <div 
                className="bg-white border-4 border-black p-2 mx-auto"
                style={{
                  borderRadius: '8px',
                  height: '60px',
                  width: '350px'
                }}
              >
                <input
                  type="text"
                  placeholder="enter a number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full h-full text-left text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                  style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '25px',
                    letterSpacing: '0px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Example */}
        <div className="flex flex-col items-center" style={{ width: '400px' }}>
          {/* Timer with countdown - right aligned to yellow box with space */}
          <div className="h-[40px] mb-8 flex justify-end" style={{ width: '400px' }}>
            <TimerDisplay timeLeft={timeLeft} />
          </div>
          
          <div className="text-center" style={{ width: '400px' }}>
            {/* Main area with example */}
            <div 
              className="bg-[#ffff00] border-4 border-black p-4 mb-4 relative overflow-hidden"
              style={{
                borderRadius: '32px',
                boxShadow: '8px 8px 0px 0px #000000',
                height: '300px',
                width: '400px'
              }}
            >
              {/* Gumball Image for Quote Warriors */}
              <div className="absolute inset-0">
                <GumballImage
                  count={120}
                  width={400}
                  height={300}
                />
              </div>
              
              {/* Example guess tags */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                <div 
                  className="bg-[#ffff00] border-2 border-black flex items-center justify-center"
                  style={{
                    borderRadius: '4px',
                    width: '211px',
                    height: '61px',
                    boxShadow: '6px 6px 0px 0px #000000'
                  }}
                >
                  <span className="text-black font-normal text-center" style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '32px',
                    fontWeight: '400',
                    letterSpacing: '-0.96px',
                    lineHeight: '44.8px'
                  }}>
                    Medium
                  </span>
                </div>
                <div 
                  className="bg-white border-2 border-black flex items-center justify-center"
                  style={{
                    borderRadius: '4px',
                    width: '124px',
                    height: '61px',
                    boxShadow: '6px 6px 0px 0px #000000'
                  }}
                >
                  <span className="text-black font-normal text-center" style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '32px',
                    fontWeight: '400',
                    letterSpacing: '-0.96px',
                    lineHeight: '44.8px'
                  }}>
                    256
                  </span>
                </div>
              </div>
            </div>
            
            {/* Instructions and input */}
            <div className="text-center mb-4">
              <p className="text-black font-normal text-xl mb-2" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '0px'
              }}>
                ... you guess with a estimate
              </p>
              <div 
                className="bg-white border-4 border-black p-2 mx-auto"
                style={{
                  borderRadius: '8px',
                  height: '60px',
                  width: '350px'
                }}
              >
                <input
                  type="text"
                  placeholder="enter a number"
                  className="w-full h-full text-left text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                  style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '25px',
                    letterSpacing: '0px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
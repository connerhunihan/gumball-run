import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { subscribeToRoom } from '../lib/room.js'

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
      if (roomData?.state?.gameStarted) {
        setGameStarted(true)
        // Navigate immediately when game starts
        handleStartGame()
      }
    })

    return () => unsubscribe()
  }, [roomId])

  // Auto-start timer (fallback)
  useEffect(() => {
    if (gameStarted) return // Don't start timer if game already started

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleStartGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted])

  const handleStartGame = () => {
    navigate('/team-competition', { 
      state: { 
        roomId,
        team1Players,
        team2Players,
        playerTeam,
        playerId
      } 
    })
  }

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Title - left aligned as in Figma */}
      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-black font-black text-5xl" style={{ 
          fontFamily: 'Lexend Exa, sans-serif',
          letterSpacing: '-4.48px',
          lineHeight: '89.6px'
        }}>
          Here's how it works
        </h1>
      </div>

      <div className="flex gap-8 max-w-5xl w-full">
        {/* Left panel - Instructions */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '400px' }}>
          <div className="text-center" style={{ width: '400px' }}>
            {/* Timer area - empty/transparent */}
            <div className="h-[40px] mb-2"></div>
            
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
              {/* Tutorial image */}
              <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-sm">Tutorial Image</span>
              </div>
            </div>
            
            {/* Instructions and input */}
            <div className="text-left mb-4">
              <p className="text-black font-normal text-xl mb-2" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '0px'
              }}>
                You make your own guess ...
              </p>
              <div 
                className="bg-white border-4 border-black p-2"
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
        <div className="flex-1 flex flex-col items-center" style={{ width: '400px' }}>
          <div className="text-center" style={{ width: '400px' }}>
            {/* Timer with countdown - clickable to skip */}
            <div 
              className="h-[40px] mb-2 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={handleStartGame}
            >
              <span className="text-black font-light text-lg tracking-widest" style={{
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '18px',
                fontWeight: '200',
                lineHeight: '25px',
                letterSpacing: '3.6px'
              }}>
                STARTS IN {timeLeft} (click to skip)
              </span>
            </div>
            
            {/* Main area with example */}
            <div 
              className="bg-[#ffff00] border-4 border-black p-4 mb-4 relative"
              style={{
                borderRadius: '32px',
                boxShadow: '4px 4px 0px 0px #000000',
                height: '300px',
                width: '400px'
              }}
            >
              {/* Example image */}
              <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-sm">Example Gumball</span>
              </div>
              
              {/* Example guess tags */}
              <div className="absolute bottom-4 right-4">
                <div 
                  className="bg-[#ffff00] border-2 border-black mb-1"
                  style={{
                    borderRadius: '2px',
                    width: '120px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="text-black font-normal text-lg" style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '22px',
                    letterSpacing: '-0.48px'
                  }}>
                    Medium
                  </span>
                </div>
                <div 
                  className="bg-white border-2 border-black"
                  style={{
                    borderRadius: '2px',
                    width: '70px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="text-black font-normal text-lg" style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '22px',
                    letterSpacing: '-0.48px'
                  }}>
                    256
                  </span>
                </div>
              </div>
            </div>
            
            {/* Instructions and input */}
            <div className="text-left mb-4">
              <p className="text-black font-normal text-xl mb-2" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '0px'
              }}>
                ... you guess with a estimate
              </p>
              <div 
                className="bg-white border-4 border-black p-2"
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
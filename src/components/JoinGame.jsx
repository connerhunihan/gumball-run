import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import GamePanel from './GamePanel.jsx'
import { getOrCreateActiveRoom, roomExists, registerVisitor, subscribeToRoom } from '../lib/room.js'

export default function JoinGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId: urlRoomId } = useParams()
  const { roomId: existingRoomId, isRoomCreator } = location.state || {}
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [roomId, setRoomId] = useState(urlRoomId || existingRoomId)
  const [isLoading, setIsLoading] = useState(!urlRoomId && !existingRoomId)
  const [roomError, setRoomError] = useState(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [visitorId, setVisitorId] = useState(null)
  const [roomData, setRoomData] = useState(null)
  const [visitors, setVisitors] = useState([])

  // Handle room setup based on URL or create new room
  useEffect(() => {
    const setupRoom = async () => {
      if (urlRoomId) {
        // Check if the room from URL exists
        try {
          setIsLoading(true)
          const exists = await roomExists(urlRoomId)
          if (exists) {
            setRoomId(urlRoomId)
            setRoomError(null)
            
            // Register this visitor
            const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
            setVisitorId(newVisitorId)
            await registerVisitor(urlRoomId, newVisitorId)
          } else {
            setRoomError('Room not found. This room may have expired or the link is invalid.')
          }
        } catch (error) {
          console.error('Error checking room:', error)
          setRoomError('Error checking room. Please try again.')
        } finally {
          setIsLoading(false)
        }
      } else if (!existingRoomId) {
        // No room ID provided, get or create active room (fallback)
        try {
          setIsLoading(true)
          const activeRoomId = await getOrCreateActiveRoom()
          setRoomId(activeRoomId)
          console.log('Got active room:', activeRoomId)
          
          // Register this visitor
          const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          setVisitorId(newVisitorId)
          await registerVisitor(activeRoomId, newVisitorId)
        } catch (error) {
          console.error('Error getting active room:', error)
          setRoomError('Error setting up room. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    setupRoom()
  }, [urlRoomId, existingRoomId])

  // Subscribe to room updates for real-time visitor tracking
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
      
      // Update visitors list
      const visitorsList = Object.values(data?.visitors || {})
      setVisitors(visitorsList)
    })

    return () => unsubscribe()
  }, [roomId])

  const handleJoinTeam = (teamName) => {
    setSelectedTeam(teamName)
    navigate('/team-setup', { 
      state: { 
        selectedTeam: teamName,
        roomId: roomId,
        visitorId: visitorId
      } 
    })
  }

  const copyRoomUrl = async () => {
    // Build the room URL using the current URL structure
    const currentUrl = window.location.href
    const baseUrl = currentUrl.split('/join/')[0] // Get everything before /join/
    const roomUrl = `${baseUrl}/join/${roomId}`
    try {
      await navigator.clipboard.writeText(roomUrl)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = roomUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    }
  }

  // Show loading state while setting up room
  if (isLoading) {
    return (
      <div className="h-screen bg-[#8eebff] flex items-center justify-center">
        <div className="text-center">
          <div className="text-black text-2xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
            Setting up game...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    )
  }

  // Show error state if room doesn't exist
  if (roomError) {
    return (
      <div className="h-screen bg-[#8eebff] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
            {roomError}
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white border-4 border-black rounded-xl px-6 py-3 text-black font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{ fontFamily: 'Lexend Exa, sans-serif' }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">
      {/* Room information header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="text-black text-lg" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Room: <span className="font-bold">{roomId}</span>
        </div>
        <button
          onClick={copyRoomUrl}
          className="bg-white border-2 border-black rounded-lg px-4 py-2 text-black font-bold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
          style={{ fontFamily: 'Lexend Exa, sans-serif' }}
        >
          📋 Copy Link
        </button>
      </div>


      {/* Copy success notification */}
      {showCopySuccess && (
        <div className="absolute top-16 right-4 bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black z-10">
          <span className="font-bold" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
            Link copied!
          </span>
        </div>
      )}

      <div className="flex gap-8 justify-center">
        {/* Team 1 - Guestimators */}
        <div className="flex flex-col items-center">
          <GamePanel>
            {/* Gumball image */}
            <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-sm">Gumball Image</span>
            </div>
            
            {/* Team name */}
            <div className="text-center">
              <h2 
                className="text-black font-normal"
                style={{ 
                  fontFamily: 'Lexend Exa, sans-serif',
                  fontSize: '24px',
                  lineHeight: '32px',
                  letterSpacing: '0px'
                }}
              >
                Guestimators
              </h2>
            </div>
          </GamePanel>
          <button
            onClick={() => handleJoinTeam('Guestimators')}
            className="bg-white border-4 border-black text-black font-black transition-all duration-200 hover:scale-105"
            style={{ 
              width: '400px',
              height: '80px',
              fontFamily: 'Lexend Exa, sans-serif',
              fontSize: '24px',
              fontWeight: '500',
              letterSpacing: '0px',
              lineHeight: '32px',
              boxShadow: '4px 4px 0px 0px #000000',
              borderRadius: '16px'
            }}
          >
            What's your name?
          </button>
        </div>

        {/* Team 2 - Quote Warriors */}
        <div className="flex flex-col items-center">
          <GamePanel>
            {/* Gumball image */}
            <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-sm">Gumball Image</span>
            </div>
            
            {/* Team name */}
            <div className="text-center">
              <h2 
                className="text-black font-normal"
                style={{ 
                  fontFamily: 'Lexend Exa, sans-serif',
                  fontSize: '24px',
                  lineHeight: '32px',
                  letterSpacing: '0px'
                }}
              >
                Quote warriors
              </h2>
            </div>
          </GamePanel>
          <button
            onClick={() => handleJoinTeam('Quote warriors')}
            className="bg-white border-4 border-black text-black font-black transition-all duration-200 hover:scale-105"
            style={{ 
              width: '400px',
              height: '80px',
              fontFamily: 'Lexend Exa, sans-serif',
              fontSize: '24px',
              fontWeight: '500',
              letterSpacing: '0px',
              lineHeight: '32px',
              boxShadow: '4px 4px 0px 0px #000000',
              borderRadius: '16px'
            }}
          >
            What's your name?
          </button>
        </div>
      </div>
    </div>
  )
}
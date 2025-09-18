import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createRoom, joinRoom, generateRoomId, updateVisitorStatus } from '../lib/room.js'

export default function PlayerSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { fromHomepage, roomId: existingRoomId, visitorId, isHost } = location.state || {}
  
  const [playerName, setPlayerName] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [roomId, setRoomId] = useState(existingRoomId)
  
  useEffect(() => {
    if (!roomId) {
      console.error("No roomId provided to PlayerSetup, returning to home.")
      navigate('/')
    }
  }, [roomId, navigate])

  const handleNameEntry = async () => {
    if (playerName.trim() !== '') {
      const trimmedName = playerName.trim()
      
      try {
        let currentRoomId = roomId
        
        if (!currentRoomId) {
          setIsCreatingRoom(true)
          const newRoomId = generateRoomId()
          currentRoomId = await createRoom(newRoomId)
          setRoomId(currentRoomId) // Set the new room ID for the copy link button
          setIsCreatingRoom(false)
        }
        
        const newPlayerId = await joinRoom(currentRoomId, trimmedName)
        
        if (visitorId) {
          await updateVisitorStatus(currentRoomId, visitorId, newPlayerId)
        }
        
        // Immediately navigate to tutorial after joining
        navigate('/tutorial', { 
          state: { 
            roomId: currentRoomId,
            playerId: newPlayerId,
            fromHomepage: fromHomepage,
            isHost: isHost // Pass isHost to the tutorial
          } 
        })

      } catch (error) {
        console.error('Error joining room:', error)
        setIsCreatingRoom(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameEntry()
    }
  }

  const copyRoomUrl = async () => {
    const baseUrl = import.meta.env.PROD 
      ? 'https://connerhunihan.github.io/gumball-run'
      : window.location.origin
    const roomUrl = `${baseUrl}/join/${roomId}`
    console.log('Copying URL:', roomUrl) // Debug log
    try {
      await navigator.clipboard.writeText(roomUrl)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      {fromHomepage && roomId && (
         <div className="absolute top-4 right-4 flex items-center z-20">
            <button
              onClick={copyRoomUrl}
              className="bg-white border-2 border-black rounded-lg px-4 py-2 text-black font-bold text-sm"
            >
              📋 Copy Link
            </button>
            {showCopySuccess && (
              <div className="ml-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                Copied!
              </div>
            )}
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="bg-white border-4 border-black p-4"
          style={{
            borderRadius: '16px',
            boxShadow: '8px 8px 0px 0px #000000',
            height: '80px',
            width: '400px'
          }}
        >
          <input
            type="text"
            placeholder="What's your name?"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-full text-center text-xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
            style={{ fontFamily: 'Lexend Exa, sans-serif' }}
          />
        </div>
        <button
          onClick={handleNameEntry}
          disabled={!playerName.trim() || isCreatingRoom}
          className="bg-[#00f22a] border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-4xl transition-all duration-200 hover:scale-105"
          style={{
            boxShadow: '8px 8px 0px 0px #000000',
            fontFamily: 'Lexend Exa, sans-serif'
          }}
        >
          {isCreatingRoom ? 'Creating...' : 'Continue'}
        </button>
      </div>

      {isHost && (
        <div className="mt-8 text-center">
          <button
            onClick={copyRoomUrl}
            className="bg-green-500 border-2 border-black rounded-lg px-6 py-2 text-lg font-bold text-white transition-all hover:bg-green-600"
          >
            Copy Invite Link
          </button>
          {showCopySuccess && (
            <div className="mt-2 text-green-700 font-semibold">
              Link Copied!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
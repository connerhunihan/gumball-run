import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleSimulationWrapper from './ParticleSimulation.jsx'
import RoomNavigation from './RoomNavigation.jsx'
import { generateRoomId, createRoom, deleteRoom } from '../lib/room.js'

export default function StartScreen() {
  const navigate = useNavigate()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [createdRooms, setCreatedRooms] = useState([])
  const [showRoomNavigation, setShowRoomNavigation] = useState(false)


  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true)
      setShowRoomNavigation(true) // Show room navigation after clicking
      const roomId = generateRoomId()
      await createRoom(roomId)
      setCreatedRooms(prev => [...prev, roomId])
      
      // Small delay to ensure room is fully created before navigation
      setTimeout(() => {
        navigate(`/join/${roomId}`, { 
          state: { fromHomepage: true } 
        })
      }, 100)
    } catch (error) {
      console.error('Error creating room:', error)
      setIsCreatingRoom(false)
    }
  }

  // Load created rooms from localStorage on mount
  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem('createdRooms') || '[]')
    setCreatedRooms(savedRooms)
    
    // Only clean up rooms that are older than 5 minutes (to avoid deleting recently created rooms)
    const cleanupOldRooms = async () => {
      // Check if we have any rooms that might be old
      if (savedRooms.length > 0) {
        console.log('Checking for old rooms to clean up...')
        // For now, let's not auto-cleanup to avoid the race condition
        // We'll rely on the 10-minute timeout in RoomNavigation instead
        console.log('Skipping auto-cleanup to avoid race conditions')
      }
    }
    
    cleanupOldRooms()
  }, [])

  // Save created rooms to localStorage
  useEffect(() => {
    localStorage.setItem('createdRooms', JSON.stringify(createdRooms))
  }, [createdRooms])

  // Cleanup rooms when component unmounts (only if browser is actually closing)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only cleanup if browser is actually closing
      createdRooms.forEach(async (roomId) => {
        try {
          await deleteRoom(roomId)
          console.log(`Cleaned up room on browser close: ${roomId}`)
        } catch (error) {
          console.error(`Error deleting room ${roomId}:`, error)
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [createdRooms])

  return (
    <div className="min-h-screen bg-[#8eebff] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated particle background */}
      <div className="absolute inset-0 opacity-30">
        <ParticleSimulationWrapper
          particleCount={50}
          colors={['#000000']}
          sizeRange={[0.05, 0.15]}
          containerSize={20}
          className="w-full h-full"
        />
      </div>

      {/* Room Navigation - only show after clicking Gumball Run */}
      {showRoomNavigation && (
        <div className="absolute top-4 left-4 z-20">
          <RoomNavigation />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center">
        <button
          onClick={handleCreateRoom}
          disabled={isCreatingRoom}
          className="bg-white border-4 border-black rounded-2xl px-16 py-8 text-black font-black text-6xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            letterSpacing: '-0.07em',
            lineHeight: '1.1'
          }}
        >
          {isCreatingRoom ? 'Creating...' : 'Gumball Run'}
        </button>
      </div>
    </div>
  )
}

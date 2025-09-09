import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleSimulationWrapper from './ParticleSimulation.jsx'
import { generateRoomId, createRoom } from '../lib/room.js'

export default function StartScreen() {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)


  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true)
      const roomId = generateRoomId()
      await createRoom(roomId)
      navigate(`/join/${roomId}`)
    } catch (error) {
      console.error('Error creating room:', error)
      setIsCreatingRoom(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center relative overflow-hidden">
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

      {/* Main content */}
      <div className="relative z-10 text-center">
        <button
          onClick={handleCreateRoom}
          disabled={isCreatingRoom}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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

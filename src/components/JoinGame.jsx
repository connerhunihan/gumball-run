import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GamePanel from './GamePanel.jsx'
import { getOrCreateActiveRoom } from '../lib/room.js'

export default function JoinGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId: existingRoomId } = location.state || {}
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [roomId, setRoomId] = useState(existingRoomId)
  const [isLoading, setIsLoading] = useState(!existingRoomId)

  // Automatically get or create active room when component mounts
  useEffect(() => {
    const setupRoom = async () => {
      if (!existingRoomId) {
        try {
          setIsLoading(true)
          const activeRoomId = await getOrCreateActiveRoom()
          setRoomId(activeRoomId)
          console.log('Got active room:', activeRoomId)
        } catch (error) {
          console.error('Error getting active room:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    setupRoom()
  }, [existingRoomId])

  const handleJoinTeam = (teamName) => {
    setSelectedTeam(teamName)
    navigate('/team-setup', { 
      state: { 
        selectedTeam: teamName,
        roomId: roomId
      } 
    })
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

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">

      <div className="flex gap-8 max-w-5xl w-full">
        {/* Team 1 - Guestimators */}
        <div className="flex flex-col items-center w-[400px]">
        <GamePanel>
          {/* Gumball image */}
          <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">Gumball Image</span>
          </div>
          
          {/* Team name */}
          <div className="text-center">
            <h2 
              className="text-black font-normal text-xl"
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
            width: '350px',
            height: '80px',
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '36px',
            fontWeight: '900',
            letterSpacing: '-2px',
            lineHeight: '48px',
            boxShadow: '4px 4px 0px 0px #000000',
            borderRadius: '16px'
          }}
        >
          JOIN
        </button>
        </div>

        {/* Team 2 - Quote Warriors */}
        <div className="flex flex-col items-center w-[400px]">
        <GamePanel>
          {/* Gumball image */}
          <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">Gumball Image</span>
          </div>
          
          {/* Team name */}
          <div className="text-center">
            <h2 
              className="text-black font-normal text-xl"
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
            width: '350px',
            height: '80px',
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '36px',
            fontWeight: '900',
            letterSpacing: '-2px',
            lineHeight: '48px',
            boxShadow: '4px 4px 0px 0px #000000',
            borderRadius: '16px'
          }}
        >
          JOIN
        </button>
        </div>
      </div>
    </div>
  )
}
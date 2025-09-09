import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GamePanel from './GamePanel.jsx'
import { createRoom, joinTeam, subscribeToRoom } from '../lib/room.js'

export default function TeamSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId: existingRoomId, selectedTeam } = location.state || {}
  
  const [roomId, setRoomId] = useState(existingRoomId)
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])
  const [team1Input, setTeam1Input] = useState('')
  const [team2Input, setTeam2Input] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [playerId, setPlayerId] = useState(null)

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (roomData) => {
      if (roomData?.teams) {
        const team1PlayerList = Object.values(roomData.teams.team1?.players || {})
        const team2PlayerList = Object.values(roomData.teams.team2?.players || {})
        setTeam1Players(team1PlayerList.map(p => p.name))
        setTeam2Players(team2PlayerList.map(p => p.name))
      }
    })

    return () => unsubscribe()
  }, [roomId])

  const handleKeyPress = async (team, e) => {
    if (e.key === 'Enter') {
      const input = team === 1 ? team1Input : team2Input
      if (input.trim() !== '') {
        const trimmedName = input.trim()
        
        try {
          let currentRoomId = roomId
          
          // Create room if it doesn't exist
          if (!currentRoomId) {
            setIsCreatingRoom(true)
            currentRoomId = await createRoom()
            setRoomId(currentRoomId)
            setIsCreatingRoom(false)
          }
          
          // Join the team
          const teamId = team === 1 ? 'team1' : 'team2'
          const newPlayerId = await joinTeam(currentRoomId, teamId, trimmedName)
          setPlayerId(newPlayerId)
          
          // Clear input
          if (team === 1) {
            setTeam1Input('')
          } else {
            setTeam2Input('')
          }
        } catch (error) {
          console.error('Error joining team:', error)
          setIsCreatingRoom(false)
        }
      }
    }
  }

  const showStartButton = team1Players.length > 0 && team2Players.length > 0

  const handleStart = () => {
    navigate('/tutorial', { 
      state: { 
        roomId,
        team1Players, 
        team2Players,
        playerTeam: selectedTeam === 'Guestimators' ? 'team1' : 'team2',
        playerId
      } 
    })
  }

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">
      <div className="flex gap-8 max-w-5xl w-full">
        {/* Team 1 Panel - Guestimators */}
        <GamePanel>
          {/* Gumball image */}
          <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">Gumball Image</span>
          </div>
          
          {/* Team name and player names */}
          <div className="text-center">
            <h2 className="text-black font-normal text-xl mb-2" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              Guestimators
            </h2>
            
            {/* Show player names if any */}
            {team1Players.length > 0 && (
              <div className="space-y-1">
                {team1Players.map((name, index) => (
                  <div key={index} className="text-black font-normal text-lg" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GamePanel>

        {/* Team 2 Panel - Quote warriors */}
        <GamePanel>
          {/* Gumball image */}
          <div className="w-full h-48 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-sm">Gumball Image</span>
          </div>
          
          {/* Team name and player names */}
          <div className="text-center">
            <h2 className="text-black font-normal text-xl mb-2" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              Quote warriors
            </h2>
            
            {/* Show player names if any */}
            {team2Players.length > 0 && (
              <div className="space-y-1">
                {team2Players.map((name, index) => (
                  <div key={index} className="text-black font-normal text-lg" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GamePanel>
      </div>

      {/* Input fields - positioned below panels */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8">
        {/* Input field for Team 1 - only show if no players yet */}
        {team1Players.length === 0 && (
          <div 
            className="bg-white border-4 border-black p-4"
            style={{
              borderRadius: '16px',
              boxShadow: '4px 4px 0px 0px #000000',
              height: '80px',
              width: '350px'
            }}
          >
            <input
              type="text"
              placeholder="What's your name?"
              value={team1Input}
              onChange={e => setTeam1Input(e.target.value)}
              onKeyPress={e => handleKeyPress(1, e)}
              className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
              style={{ fontFamily: 'Lexend Exa, sans-serif' }}
            />
          </div>
        )}

        {/* Input field for Team 2 - only show if no players yet */}
        {team2Players.length === 0 && (
          <div 
            className="bg-white border-4 border-black p-4"
            style={{
              borderRadius: '16px',
              boxShadow: '4px 4px 0px 0px #000000',
              height: '80px',
              width: '350px'
            }}
          >
            <input
              type="text"
              placeholder="What's your name?"
              value={team2Input}
              onChange={e => setTeam2Input(e.target.value)}
              onKeyPress={e => handleKeyPress(2, e)}
              className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
              style={{ fontFamily: 'Lexend Exa, sans-serif' }}
            />
          </div>
        )}
      </div>

      {/* Start button - show in the middle when both teams have players */}
      {showStartButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleStart}
            className="bg-[#00f22a] border-4 border-black text-black font-black transition-all duration-200 hover:scale-105"
            style={{ 
              width: '400px',
              height: '100px',
              fontFamily: 'Lexend Exa, sans-serif',
              fontSize: '48px',
              fontWeight: '900',
              letterSpacing: '-3px',
              lineHeight: '64px',
              boxShadow: '4px 4px 0px 0px #000000',
              borderRadius: '16px'
            }}
          >
            Start
          </button>
        </div>
      )}
    </div>
  )
}
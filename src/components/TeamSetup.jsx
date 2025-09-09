import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GamePanel from './GamePanel.jsx'
import { createRoom, joinTeam, subscribeToRoom, generateRoomId, startGame } from '../lib/room.js'

export default function TeamSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId: existingRoomId, selectedTeam } = location.state || {}
  
  // Determine which team the user selected
  const userTeam = selectedTeam === 'Guestimators' ? 1 : 2
  
  const [roomId, setRoomId] = useState(existingRoomId)
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])
  const [team1Input, setTeam1Input] = useState('')
  const [team2Input, setTeam2Input] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [playerId, setPlayerId] = useState(null)
  const [totalJoined, setTotalJoined] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [hasStartedGame, setHasStartedGame] = useState(false)

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
      
      // Update total joined count and game started state
      if (roomData?.totalJoined !== undefined) {
        setTotalJoined(roomData.totalJoined)
      }
      if (roomData?.state?.gameStarted !== undefined) {
        setGameStarted(roomData.state.gameStarted)
        
        // If game started and this device didn't start it, navigate to tutorial
        if (roomData.state.gameStarted && !hasStartedGame) {
          console.log('Game started by another device, navigating to tutorial', {
            gameStarted: roomData.state.gameStarted,
            hasStartedGame,
            roomId,
            playerTeam: selectedTeam === 'Guestimators' ? 'team1' : 'team2'
          })
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
      }
    })

    return () => unsubscribe()
  }, [roomId, hasStartedGame, navigate, team1Players, team2Players, selectedTeam, playerId])

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
            const newRoomId = generateRoomId()
            currentRoomId = await createRoom(newRoomId)
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

  const showStartButton = (userTeam === 1 && team1Players.length > 0) || (userTeam === 2 && team2Players.length > 0)

  const handleStart = async () => {
    if (!hasStartedGame) {
      setHasStartedGame(true)
      try {
        await startGame(roomId)
        // Wait a moment for the state to update, then navigate
        setTimeout(() => {
          navigate('/tutorial', { 
            state: { 
              roomId,
              team1Players, 
              team2Players,
              playerTeam: selectedTeam === 'Guestimators' ? 'team1' : 'team2',
              playerId
            } 
          })
        }, 500)
      } catch (error) {
        console.error('Error starting game:', error)
        setHasStartedGame(false)
      }
    }
  }


  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center p-4 overflow-hidden">
      <div className="flex gap-8 justify-center">
        {/* Team 1 Panel - Guestimators */}
        <div className="flex flex-col items-center">
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

          {/* Input field for Team 1 - always show to maintain layout */}
          <div 
            className={`bg-white border-4 border-black p-4 mt-4 ${userTeam === 1 && team1Players.length === 0 ? 'block' : 'invisible'}`}
            style={{
              borderRadius: '16px',
              boxShadow: '4px 4px 0px 0px #000000',
              height: '80px',
              width: '400px'
            }}
          >
            <input
              type="text"
              placeholder="What's your name?"
              value={team1Input}
              onChange={e => setTeam1Input(e.target.value)}
              onKeyPress={e => handleKeyPress(1, e)}
              className="w-full h-full text-center text-xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
              style={{ fontFamily: 'Lexend Exa, sans-serif' }}
            />
          </div>
        </div>

        {/* Team 2 Panel - Quote warriors */}
        <div className="flex flex-col items-center">
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

          {/* Input field for Team 2 - always show to maintain layout */}
          <div 
            className={`bg-white border-4 border-black p-4 mt-4 ${userTeam === 2 && team2Players.length === 0 ? 'block' : 'invisible'}`}
            style={{
              borderRadius: '16px',
              boxShadow: '4px 4px 0px 0px #000000',
              height: '80px',
              width: '400px'
            }}
          >
            <input
              type="text"
              placeholder="What's your name?"
              value={team2Input}
              onChange={e => setTeam2Input(e.target.value)}
              onKeyPress={e => handleKeyPress(2, e)}
              className="w-full h-full text-center text-xl font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
              style={{ fontFamily: 'Lexend Exa, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Start button - show in the middle when both teams have players */}
      {showStartButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleStart}
            disabled={hasStartedGame || gameStarted}
            className={`border-4 border-black text-black font-black transition-all duration-200 ${
              hasStartedGame || gameStarted 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#00f22a] hover:scale-105'
            }`}
            style={{ 
              width: '400px',
              height: '100px',
              fontFamily: 'Lexend Exa, sans-serif',
              fontSize: hasStartedGame || gameStarted ? '24px' : '48px',
              fontWeight: '900',
              letterSpacing: '-3px',
              lineHeight: hasStartedGame || gameStarted ? '32px' : '64px',
              boxShadow: '4px 4px 0px 0px #000000',
              borderRadius: '16px'
            }}
          >
            {hasStartedGame || gameStarted 
              ? `Waiting for others, ${totalJoined} of ${totalJoined} have joined`
              : 'Start'
            }
          </button>
        </div>
      )}
    </div>
  )
}
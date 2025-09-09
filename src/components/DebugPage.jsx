import { useState, useEffect } from 'react'
import { createRoom, joinTeam, subscribeToRoom, generateRoomId } from '../lib/room.js'

export default function DebugPage() {
  const [roomId, setRoomId] = useState(null)
  const [roomData, setRoomData] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [status, setStatus] = useState('Ready to test')

  const testRoomCreation = async () => {
    try {
      setStatus('Creating room...')
      const newRoomId = generateRoomId()
      await createRoom(newRoomId)
      setRoomId(newRoomId)
      setStatus(`Room created: ${newRoomId}`)
      
      // Subscribe to room updates
      const unsubscribe = subscribeToRoom(newRoomId, (data) => {
        setRoomData(data)
        setStatus(`Room data updated: ${JSON.stringify(data, null, 2)}`)
      })
      
      // Join team2 (Quote warriors)
      setStatus('Joining team2...')
      const newPlayerId = await joinTeam(newRoomId, 'team2', 'Test Player')
      setPlayerId(newPlayerId)
      setStatus(`Joined team2 with playerId: ${newPlayerId}`)
      
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      console.error('Test error:', error)
    }
  }

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <button 
        onClick={testRoomCreation}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Test Room Creation
      </button>
      
      <div className="bg-white p-4 rounded max-w-2xl">
        <h2 className="font-bold mb-2">Status:</h2>
        <p className="mb-2">{status}</p>
        
        <h2 className="font-bold mb-2">Room ID:</h2>
        <p className="mb-2">{roomId || 'None'}</p>
        
        <h2 className="font-bold mb-2">Player ID:</h2>
        <p className="mb-2">{playerId || 'None'}</p>
        
        <h2 className="font-bold mb-2">Room Data:</h2>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {roomData ? JSON.stringify(roomData, null, 2) : 'None'}
        </pre>
      </div>
    </div>
  )
}

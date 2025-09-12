import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { database } from '../lib/firebase.js'
import { ref, onValue, off, remove } from 'firebase/database'

export default function RoomNavigation({ currentRoomId }) {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    // Listen to all rooms
    const roomsRef = ref(database, 'rooms')
    
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val()
      if (roomsData) {
        const now = Date.now()
        const roomsList = Object.entries(roomsData).map(([roomId, roomData]) => {
          const team1Players = Object.values(roomData?.teams?.team1?.players || {})
          const team2Players = Object.values(roomData?.teams?.team2?.players || {})
          const totalPlayers = team1Players.length + team2Players.length
          const createdAt = roomData?.createdAt || 0
          const isRecent = (now - createdAt) < (10 * 60 * 1000) // 10 minutes
          
          return {
            roomId,
            playerCount: totalPlayers,
            isActive: roomData?.state?.gameStarted !== true && isRecent, // Room is active if game hasn't started and is recent
            createdAt: createdAt
          }
        }).filter(room => room.isActive && room.playerCount > 0) // Only show active rooms with players
         .sort((a, b) => b.createdAt - a.createdAt) // Sort by newest first
        
        console.log('RoomNavigation: Found rooms:', roomsList)
        setRooms(roomsList)
      } else {
        setRooms([])
      }
    })

    return () => {
      off(roomsRef, 'value', unsubscribe)
    }
  }, [])

  const handleRoomClick = (roomId) => {
    navigate(`/join/${roomId}`)
  }


  if (rooms.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {rooms.map((room) => (
        <button
          key={room.roomId}
          onClick={() => handleRoomClick(room.roomId)}
          className={`px-3 py-1 rounded border-2 text-sm font-bold transition-all duration-200 hover:scale-105 ${
            room.roomId === currentRoomId
              ? 'bg-[#1BEDCA] border-black text-black'
              : 'bg-white border-black text-black hover:bg-gray-100'
          }`}
          style={{
            fontFamily: 'Lexend Exa, sans-serif',
            boxShadow: '4px 4px 0px 0px #000000'
          }}
        >
          Room: {room.roomId} (Players: {room.playerCount})
        </button>
      ))}
    </div>
  )
}

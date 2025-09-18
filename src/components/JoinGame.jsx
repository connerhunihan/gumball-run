import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// This component now acts as a gateway. It captures the roomId from the URL,
// stores it in sessionStorage, and then redirects to the homepage.
// The homepage component will then handle the logic for joining the room.
export default function JoinGame() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (roomId) {
      console.log('Join link clicked. Storing roomId:', roomId)
      sessionStorage.setItem('joinRoomId', roomId)
      navigate('/')
    } else {
      console.warn('No roomId found in URL, redirecting to home.')
      navigate('/')
    }
  }, [roomId, navigate])

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center">
      <div className="text-black text-2xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
        Joining game...
      </div>
    </div>
  )
}
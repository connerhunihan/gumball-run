import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { roomExists, registerVisitor } from '../lib/room.js'

export default function JoinGame() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const location = useLocation()
  const [status, setStatus] = useState('Verifying room...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyAndJoin = async () => {
      try {
        const exists = await roomExists(roomId)
        if (exists) {
          setStatus('Room found! Joining...')
          const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          await registerVisitor(roomId, newVisitorId)
          
          // Redirect to player setup with the roomId
          navigate('/player-setup', {
            state: {
              roomId: roomId,
              visitorId: newVisitorId,
              fromHomepage: location.state?.fromHomepage || false
            },
            replace: true // Replace the history entry so user can't go back to this page
          })
        } else {
          setError('Room not found. The link may have expired or is invalid.')
        }
      } catch (err) {
        setError('An error occurred while trying to join the room.')
        console.error(err)
      }
    }
    
    if (roomId) {
      verifyAndJoin()
    } else {
      setError('No Room ID provided.')
    }
  }, [roomId, navigate, location.state])

  return (
    <div className="h-screen bg-[#8eebff] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 text-xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              {error}
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-white border-4 border-black rounded-xl px-6 py-3 text-black font-bold text-lg"
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <div className="text-black text-2xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
              {status}
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          </>
        )}
      </div>
    </div>
  )
}
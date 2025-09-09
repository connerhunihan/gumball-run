import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GamePanel from './GamePanel.jsx'

export default function JoinGame() {
  const navigate = useNavigate()
  const [selectedTeam, setSelectedTeam] = useState(null)

  const handleJoinTeam = (teamName) => {
    setSelectedTeam(teamName)
    navigate('/team-setup', { 
      state: { 
        selectedTeam: teamName 
      } 
    })
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
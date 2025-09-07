import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinGame() {
  const navigate = useNavigate()
  const [selectedTeam, setSelectedTeam] = useState(null)

  const handleJoinTeam = (teamName) => {
    setSelectedTeam(teamName)
    navigate('/team-setup')
  }

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-20 max-w-7xl w-full">
        {/* Team 1 - Guestimators */}
        <div className="w-[567px]">
          <div className="text-center">
            {/* Timer area - empty/transparent */}
            <div className="h-[63px] mb-4"></div>
            
            {/* Main area */}
            <div 
              className="bg-[#ffff00] border-4 border-black p-8 mb-6"
              style={{
                width: '567px',
                height: '517px',
                borderRadius: '64px',
                boxShadow: '8px 8px 0px 0px #000000'
              }}
            >
              {/* Gumball image */}
              <div 
                className="mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center"
                style={{
                  width: '263px',
                  height: '227px'
                }}
              >
                <span className="text-gray-600 text-lg">Gumball Image</span>
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 
                  className="text-black font-normal"
                  style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '32px',
                    lineHeight: '44.8px',
                    letterSpacing: '0px'
                  }}
                >
                  Guestimators
                </h2>
              </div>
            </div>
            
            {/* Join button */}
            <button
              onClick={() => handleJoinTeam('Guestimators')}
              className="bg-white border-4 border-black text-black font-black transition-all duration-200 hover:scale-105"
              style={{ 
                width: '567px',
                height: '154px',
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '64px',
                fontWeight: '900',
                letterSpacing: '-4.48px',
                lineHeight: '89.6px',
                boxShadow: '8px 8px 0px 0px #000000',
                borderRadius: '16px'
              }}
            >
              JOIN
            </button>
          </div>
        </div>

        {/* Team 2 - Quote Warriors */}
        <div className="w-[567px]">
          <div className="text-center">
            {/* Timer area - empty/transparent */}
            <div className="h-[63px] mb-4"></div>
            
            {/* Main area */}
            <div 
              className="bg-[#ffff00] border-4 border-black p-8 mb-6"
              style={{
                width: '567px',
                height: '517px',
                borderRadius: '64px',
                boxShadow: '8px 8px 0px 0px #000000'
              }}
            >
              {/* Gumball image */}
              <div 
                className="mx-auto mb-6 bg-gray-300 rounded-lg flex items-center justify-center"
                style={{
                  width: '263px',
                  height: '227px'
                }}
              >
                <span className="text-gray-600 text-lg">Gumball Image</span>
              </div>
              
              {/* Team name */}
              <div className="text-center">
                <h2 
                  className="text-black font-normal"
                  style={{ 
                    fontFamily: 'Lexend Exa, sans-serif',
                    fontSize: '32px',
                    lineHeight: '44.8px',
                    letterSpacing: '0px'
                  }}
                >
                  Quote warriors
                </h2>
              </div>
            </div>
            
            {/* Join button */}
            <button
              onClick={() => handleJoinTeam('Quote warriors')}
              className="bg-white border-4 border-black text-black font-black transition-all duration-200 hover:scale-105"
              style={{ 
                width: '567px',
                height: '154px',
                fontFamily: 'Lexend Exa, sans-serif',
                fontSize: '64px',
                fontWeight: '900',
                letterSpacing: '-4.48px',
                lineHeight: '89.6px',
                boxShadow: '8px 8px 0px 0px #000000',
                borderRadius: '16px'
              }}
            >
              JOIN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
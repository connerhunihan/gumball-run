import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TeamSetup() {
  const navigate = useNavigate()
  
  const [team1Players, setTeam1Players] = useState([''])
  const [team2Players, setTeam2Players] = useState([''])

  const addPlayerToTeam = (team, index) => {
    if (team === 'team1') {
      const newPlayers = [...team1Players]
      newPlayers[index] = ''
      setTeam1Players([...newPlayers, ''])
    } else {
      const newPlayers = [...team2Players]
      newPlayers[index] = ''
      setTeam2Players([...newPlayers, ''])
    }
  }

  const updatePlayerName = (team, index, name) => {
    if (team === 'team1') {
      const newPlayers = [...team1Players]
      newPlayers[index] = name
      setTeam1Players(newPlayers)
    } else {
      const newPlayers = [...team2Players]
      newPlayers[index] = name
      setTeam2Players(newPlayers)
    }
  }

  const handleContinue = () => {
    const team1ValidPlayers = team1Players.filter(name => name.trim())
    const team2ValidPlayers = team2Players.filter(name => name.trim())
    
    if (team1ValidPlayers.length > 0 && team2ValidPlayers.length > 0) {
      navigate('/tutorial', { 
        state: { 
          team1Players: team1ValidPlayers,
          team2Players: team2ValidPlayers
        } 
      })
    }
  }

  const canContinue = team1Players.some(name => name.trim()) && team2Players.some(name => name.trim())

  return (
    <div className="min-h-screen bg-[#8eebff] flex items-center justify-center p-8">
      <div className="flex gap-20 max-w-7xl w-full">
        {/* Team 1 Panel - Guestimators */}
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
            
            {/* Player name inputs */}
            <div className="space-y-4">
              {team1Players.map((name, index) => (
                <div 
                  key={index}
                  className="bg-white border-4 border-black"
                  style={{
                    width: '567px',
                    height: '154px',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0px 0px #000000'
                  }}
                >
                  <input
                    type="text"
                    placeholder="What's your name?"
                    value={name}
                    onChange={e => updatePlayerName('team1', index, e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && name.trim()) {
                        addPlayerToTeam('team1', index)
                      }
                    }}
                    className="w-full h-full text-center border-none outline-none bg-transparent"
                    style={{ 
                      fontFamily: 'Lexend Exa, sans-serif',
                      fontSize: '32px',
                      fontWeight: '500',
                      lineHeight: '44.8px',
                      letterSpacing: '0px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team 2 Panel - Quote warriors */}
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
            
            {/* Player name inputs */}
            <div className="space-y-4">
              {team2Players.map((name, index) => (
                <div 
                  key={index}
                  className="bg-white border-4 border-black"
                  style={{
                    width: '567px',
                    height: '154px',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0px 0px #000000'
                  }}
                >
                  <input
                    type="text"
                    placeholder="What's your name?"
                    value={name}
                    onChange={e => updatePlayerName('team2', index, e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter' && name.trim()) {
                        addPlayerToTeam('team2', index)
                      }
                    }}
                    className="w-full h-full text-center border-none outline-none bg-transparent"
                    style={{ 
                      fontFamily: 'Lexend Exa, sans-serif',
                      fontSize: '32px',
                      fontWeight: '500',
                      lineHeight: '44.8px',
                      letterSpacing: '0px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bg-white border-4 border-black text-black font-black transition-all duration-200 hover:scale-105 disabled:opacity-50"
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
          CONTINUE
        </button>
      </div>
    </div>
  )
}
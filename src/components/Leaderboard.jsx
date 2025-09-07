import { useNavigate } from 'react-router-dom'

export default function Leaderboard() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  // Sample leaderboard data
  const leaderboardData = [
    { score: 2514, players: "Terry Gates, Kelly", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
    { score: 2514, players: "Brad Smalt, Choua Vang", type: "BY HAND", region: "MID ATLANTIC" },
  ]

  return (
    <div className="min-h-screen bg-[#3300ff] p-8">
      {/* Nav Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-transparent border border-white rounded-lg p-6">
          <div className="flex justify-between items-center">
            {/* Left side - HIGH SCORES */}
            <div className="flex items-center">
              <h1 className="text-white font-normal text-3xl mr-8" style={{ 
                fontFamily: 'Lexend Exa, sans-serif',
                letterSpacing: '-0.07em'
              }}>
                HIGH SCORES
              </h1>
              <div className="w-px h-12 bg-white"></div>
            </div>
            
            {/* Right side - HOME button */}
            <div className="flex items-center">
              <div className="w-px h-12 bg-white mr-8"></div>
              <button
                onClick={handleGoHome}
                className="text-white font-normal text-3xl hover:underline transition-all duration-200"
                style={{ 
                  fontFamily: 'Lexend Exa, sans-serif',
                  letterSpacing: '-0.07em'
                }}
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div key={index} className="bg-transparent border border-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                {/* Left side - Score and Players */}
                <div className="flex items-center">
                  <div className="w-80 text-center">
                    <span className="text-white font-black text-6xl" style={{ 
                      fontFamily: 'Lexend Exa, sans-serif',
                      letterSpacing: '-0.07em'
                    }}>
                      {entry.score}
                    </span>
                  </div>
                  <div className="ml-8">
                    <span className="text-white font-normal text-3xl" style={{ 
                      fontFamily: 'Lexend Exa, sans-serif'
                    }}>
                      {entry.players}
                    </span>
                  </div>
                </div>

                {/* Right side - Type and Region */}
                <div className="flex items-center space-x-8">
                  {/* Player type with icon */}
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#ff4910] border border-white rounded mr-4"></div>
                    <span className="text-white font-normal text-3xl" style={{ 
                      fontFamily: 'Lexend Exa, sans-serif',
                      letterSpacing: '-0.07em'
                    }}>
                      {entry.type}
                    </span>
                  </div>
                  
                  {/* Region tag */}
                  <div className="bg-[#e2ff33] border border-black rounded px-4 py-2">
                    <span className="text-black font-normal text-3xl" style={{ 
                      fontFamily: 'Lexend Exa, sans-serif',
                      letterSpacing: '-0.07em'
                    }}>
                      {entry.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
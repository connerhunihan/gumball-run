import React from 'react'
import TeamStats from './TeamStats.jsx'

export default function StarScore({ score = 0, teamName = '', playerStats = { guessCount: 0, totalAccuracy: 0 } }) {
  const averageAccuracy = playerStats.guessCount > 0 ? playerStats.totalAccuracy / playerStats.guessCount : 0;
  return (
    <div className="relative">
      <svg width="293" height="323" viewBox="0 0 293 323" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M135.656 27.7471C139.901 18.4751 153.075 18.4751 157.32 27.7471L161.997 37.9609C166.126 46.9782 177.604 49.7539 185.397 43.6201L193.171 37.502C201.049 31.3015 212.596 37.0117 212.451 47.0361L212.239 61.75C212.103 71.2127 220.495 78.5341 229.852 77.1152L241.474 75.3525C250.998 73.9081 258.21 83.7781 253.938 92.4131L246.288 107.879C242.323 115.896 246.042 125.592 254.352 128.9L268.477 134.524C277.166 137.984 278.663 149.649 271.128 155.19L257.742 165.033C250.643 170.253 249.402 180.373 255.028 187.154L266.114 200.516C272.153 207.793 267.713 218.866 258.32 219.957L244.955 221.509C235.836 222.568 229.691 231.355 231.824 240.283L235.612 256.137C237.899 265.707 228.255 273.767 219.243 269.817L209.652 265.614C200.741 261.709 190.493 266.993 188.508 276.519L185.881 289.128C183.81 299.067 171.052 302.028 164.816 294.016L158.576 285.998C152.444 278.118 140.533 278.118 134.4 285.998L128.16 294.016C121.925 302.027 109.167 299.068 107.096 289.129L104.469 276.519C102.484 266.993 92.2368 261.709 83.3252 265.614L73.7344 269.817C64.7222 273.767 55.0785 265.707 57.3652 256.137L61.1533 240.283C63.2867 231.354 57.1404 222.568 48.0215 221.509L34.6562 219.957C25.2635 218.866 20.8243 207.793 26.8623 200.516L37.9482 187.154C43.5752 180.373 42.3337 170.254 35.2344 165.033L21.8496 155.19C14.3144 149.65 15.8104 137.984 24.5 134.524L38.625 128.9C46.9352 125.592 50.6541 115.896 46.6885 107.879L39.0391 92.4131C34.7678 83.7781 41.9792 73.9079 51.5039 75.3525L63.125 77.1152C72.4818 78.5344 80.8737 71.2129 80.7373 61.75L80.5254 47.0361C80.3808 37.0118 91.9277 31.3019 99.8057 37.502L107.579 43.6201C115.372 49.7539 126.851 46.978 130.979 37.9609L135.656 27.7471Z" 
          fill="#3300FF" 
          stroke="black" 
          strokeWidth="3.40385"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          style={{
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '48px',
            fontWeight: 'bold'
          }}
        >
          {score}
        </text>
      </svg>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-black font-normal text-lg" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          {teamName}
        </span>
      </div>
      
      {/* Team Stats - positioned below team name */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-64">
        <TeamStats 
          accuracy={averageAccuracy} 
          guessCount={playerStats.guessCount} 
        />
      </div>
    </div>
  )
}
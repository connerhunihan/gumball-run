import React from 'react'

export default function ScoreCounter({ score, teamName }) {
  return (
    <div className="flex flex-col items-center">
      {/* Star-shaped score counter */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: '293px',
          height: '323px'
        }}
      >
        {/* Star background */}
        <div 
          className="absolute inset-0"
          style={{
            background: '#3300ff',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            border: '4px solid #000000'
          }}
        />
        
        {/* Score text */}
        <div 
          className="relative z-10 text-white font-semibold"
          style={{
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '64px',
            fontWeight: '600',
            lineHeight: '89.6px',
            letterSpacing: '0px'
          }}
        >
          {score}
        </div>
      </div>
      
      {/* Team name */}
      <div className="mt-4">
        <h3 
          className="text-black font-normal text-center"
          style={{
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '0px'
          }}
        >
          {teamName}
        </h3>
      </div>
    </div>
  )
}


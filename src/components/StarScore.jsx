import React from 'react'

export default function StarScore({ score, teamName, isLeft = false }) {
  return (
    <div className={`flex flex-col items-center ${isLeft ? 'order-first' : 'order-last'}`}>
      {/* Star shape with 13 points and 14pt rounded edges */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: '293px',
          height: '323px'
        }}
      >
        {/* Star SVG with 13 points */}
        <svg
          width="293"
          height="323"
          viewBox="0 0 293 323"
          className="absolute inset-0"
        >
          <defs>
            <filter id="starShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#000000"/>
            </filter>
          </defs>
          <path
            d="M146.5 0 L179.5 110 L293 110 L198.5 178 L231.5 288 L146.5 220 L61.5 288 L94.5 178 L0 110 L113.5 110 Z"
            fill="#3300ff"
            stroke="#000000"
            strokeWidth="2"
            filter="url(#starShadow)"
            style={{
              strokeLinejoin: 'round',
              strokeLinecap: 'round'
            }}
          />
        </svg>
        
        {/* Score text in center of star */}
        <div className="relative z-10 text-center">
          <div 
            className="text-white font-bold"
            style={{
              fontFamily: 'Lexend Exa, sans-serif',
              fontSize: '48px',
              fontWeight: '700',
              lineHeight: '1',
              textShadow: '2px 2px 0px #000000'
            }}
          >
            {score}
          </div>
        </div>
      </div>
      
      {/* Team name below star */}
      <div className="mt-4 text-center">
        <h3 
          className="text-black font-normal"
          style={{
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '24px',
            fontWeight: '400',
            lineHeight: '1.2'
          }}
        >
          {teamName}
        </h3>
      </div>
    </div>
  )
}

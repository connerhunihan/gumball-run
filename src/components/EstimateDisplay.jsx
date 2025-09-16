import React from 'react'

export default function EstimateDisplay({ confidence, guess }) {
  const getConfidenceColor = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-red-500'
      case 'Medium':
        return 'bg-yellow-400'
      case 'High':
        return 'bg-green-500'
      default:
        return 'bg-yellow-400'
    }
  }

  const getTextColor = (level) => {
    return level === 'Low' ? 'text-white' : 'text-black'
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      {/* Confidence tag */}
      <div 
        className={`${getConfidenceColor(confidence)} border-2 border-black flex items-center justify-center select-none`}
        style={{
          borderRadius: '4px',
          width: '211px',
          height: '61px',
          boxShadow: '6px 6px 0px 0px #000000'
        }}
      >
        <span 
          className={`${getTextColor(confidence)} font-normal text-center`}
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '32px',
            fontWeight: '400',
            letterSpacing: '-0.96px',
            lineHeight: '44.8px'
          }}
        >
          {confidence}
        </span>
      </div>

      {/* Number tag */}
      <div 
        className="bg-white border-2 border-black flex items-center justify-center"
        style={{
          borderRadius: '4px',
          width: '124px',
          height: '61px',
          boxShadow: '6px 6px 0px 0px #000000'
        }}
      >
        <div
          className="w-full h-full text-center text-black flex items-center justify-center"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '32px',
            fontWeight: '400',
            letterSpacing: '-0.96px',
            lineHeight: '44.8px'
          }}
        >
          {guess}
        </div>
      </div>
    </div>
  )
}

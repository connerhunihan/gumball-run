import React from 'react'

export default function TeamStats({ accuracy = 0, guessCount = 0 }) {
  return (
    <div className="w-full space-y-2">
      {/* Accuracy Slider */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Accuracy
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#00f22a] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, accuracy * 100))}%` }}
          />
        </div>
        <span className="text-sm font-medium text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          {Math.round(accuracy * 100)}%
        </span>
      </div>

      {/* Guess Counter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Guesses
        </span>
        <div className="flex-1 text-right">
          <span className="text-sm font-medium text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
            {guessCount}
          </span>
        </div>
      </div>
    </div>
  )
}

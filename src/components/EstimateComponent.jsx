import { useState, useEffect, useMemo } from 'react'

export default function EstimateComponent({ onSubmitGuess, isSubmitting, actualCount }) {
  const [confidence, setConfidence] = useState(50) // Confidence as a percentage (0-100)
  
  // Generate a plausible guess that is stable for the duration of the round
  const plausibleGuess = useMemo(() => {
    if (!actualCount) return 0
    
    // Generate a guess that's within a reasonable margin of the actual count
    const errorMargin = 0.35 // Guess can be off by up to 35%
    const randomError = (Math.random() - 0.5) * 2 * errorMargin // -0.35 to +0.35
    return Math.max(1, Math.round(actualCount * (1 + randomError)))
  }, [actualCount])

  const handleSubmit = () => {
    if (plausibleGuess && !isSubmitting) {
      // Pass the guess and the confidence (as a 0-1 float)
      onSubmitGuess(plausibleGuess.toString(), confidence / 100)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div 
      className="bg-white border-4 border-black p-4 rounded-2xl w-full flex flex-col items-center gap-4"
      style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      onKeyPress={handleKeyPress}
    >
      <div className="text-center">
        <p className="text-lg font-medium text-gray-600" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Suggested Guess
        </p>
        <p className="text-4xl font-bold text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          {plausibleGuess}
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center gap-2">
        <label className="text-lg font-medium text-black" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Confidence: {confidence}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => setConfidence(parseInt(e.target.value))}
          className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isSubmitting}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#00f22a] border-4 border-black rounded-xl px-6 py-3 text-black font-bold text-2xl transition-all duration-200 hover:scale-105 disabled:bg-gray-400"
        style={{ boxShadow: '4px 4px 0px 0px #000000' }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

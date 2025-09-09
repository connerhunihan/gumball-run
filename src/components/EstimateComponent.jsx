import { useState, useEffect } from 'react'

export default function EstimateComponent({ onSubmitGuess, isSubmitting, actualCount, particleCount }) {
  const [confidence, setConfidence] = useState('Medium')
  const [number, setNumber] = useState('')

  // Cycle confidence levels only when actualCount changes (new round)
  useEffect(() => {
    if (actualCount) {
      const levels = ['Low', 'Medium', 'High']
      const randomIndex = Math.floor(Math.random() * levels.length)
      setConfidence(levels[randomIndex])
    }
  }, [actualCount])

  // Use particle count if available, otherwise use actualCount
  const currentCount = particleCount || actualCount

  // Calculate confidence intervals based on actual count
  const getConfidenceInterval = (actual, level) => {
    if (!actual) return null
    
    switch (level) {
      case 'Low':
        // Low confidence: below 90% of actual
        return Math.round(actual * 0.85)
      case 'Medium':
        // Medium confidence: 90-95% of actual
        return Math.round(actual * 0.925)
      case 'High':
        // High confidence: 95% of actual
        return Math.round(actual * 0.95)
      default:
        return actual
    }
  }

  // Update number when confidence changes (if we have actual count)
  useEffect(() => {
    if (currentCount) {
      const newNumber = getConfidenceInterval(currentCount, confidence)
      setNumber(newNumber.toString())
    }
  }, [confidence, currentCount])

  const handleSubmit = () => {
    if (number.trim() && !isSubmitting) {
      onSubmitGuess(number, confidence)
      setNumber('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      {/* Confidence tag */}
      <div 
        className="bg-[#ffff00] border-2 border-black flex items-center justify-center select-none"
        style={{
          borderRadius: '4px',
          width: '211px',
          height: '61px'
        }}
      >
        <span 
          className="text-black font-normal text-center"
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
          height: '61px'
        }}
      >
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="?"
          disabled={isSubmitting}
          className="w-full h-full text-center text-black border-none outline-none bg-transparent disabled:opacity-50"
          style={{ 
            fontFamily: 'Lexend Exa, sans-serif',
            fontSize: '32px',
            fontWeight: '400',
            letterSpacing: '-0.96px',
            lineHeight: '44.8px'
          }}
          min={1}
        />
      </div>
    </div>
  )
}

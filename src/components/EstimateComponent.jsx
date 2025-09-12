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

  // Calculate confidence intervals based on actual count with more variation
  const getConfidenceInterval = (actual, level) => {
    if (!actual) return null
    
    // Add some randomness to make guesses vary more between rounds
    const randomFactor = 0.9 + (Math.random() * 0.2) // Random between 0.9 and 1.1
    
    switch (level) {
      case 'Low':
        // Low confidence: 70-85% of actual with variation
        return Math.round(actual * (0.7 + Math.random() * 0.15) * randomFactor)
      case 'Medium':
        // Medium confidence: 85-95% of actual with variation
        return Math.round(actual * (0.85 + Math.random() * 0.1) * randomFactor)
      case 'High':
        // High confidence: 95-105% of actual with variation
        return Math.round(actual * (0.95 + Math.random() * 0.1) * randomFactor)
      default:
        return Math.round(actual * randomFactor)
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

  // Get confidence color based on level
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

  // Get text color based on confidence level
  const getTextColor = (level) => {
    return level === 'Low' ? 'text-white' : 'text-black'
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
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
          {number || '?'}
        </div>
      </div>
    </div>
  )
}

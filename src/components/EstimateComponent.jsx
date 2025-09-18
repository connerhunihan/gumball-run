import { useState, useMemo } from 'react'
import EstimateDisplay from './EstimateDisplay'

export default function EstimateComponent({ onSubmitGuess, isSubmitting, actualCount }) {
  const [confidence, setConfidence] = useState('Medium')

  const confidenceValueMap = {
    'Low': 0.6,
    'Medium': 0.8,
    'High': 0.95
  }

  const estimate = useMemo(() => {
    if (!actualCount) return 0
    
    // Generate confidence level with weighted probability (more Medium/High than Low)
    const random = Math.random()
    let randomLevel
    if (random < 0.2) {
      randomLevel = 'Low' // 20% chance
    } else if (random < 0.7) {
      randomLevel = 'Medium' // 50% chance
    } else {
      randomLevel = 'High' // 30% chance
    }
    setConfidence(randomLevel)

    // Generate estimate based on confidence level with correct accuracy thresholds
    let errorMargin
    switch (randomLevel) {
      case 'High':
        errorMargin = 0.03 // within 3%
        break
      case 'Medium':
        errorMargin = 0.08 // within 8%
        break
      case 'Low':
        errorMargin = 0.15 // within 15%
        break
      default:
        errorMargin = 0.08
    }

    const randomError = (Math.random() - 0.5) * 2 * errorMargin
    return Math.max(1, Math.round(actualCount * (1 + randomError)))
  }, [actualCount])

  const handleSubmit = () => {
    if (estimate && !isSubmitting) {
      onSubmitGuess(estimate.toString(), confidenceValueMap[confidence])
    }
  }

  return (
    <EstimateDisplay confidence={confidence} guess={estimate} />
  )
}

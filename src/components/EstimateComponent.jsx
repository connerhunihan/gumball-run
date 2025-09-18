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
    
    // Generate estimate with random error (weighted toward more accurate estimates)
    const random = Math.random()
    let errorMargin
    
    // Weighted probability for error margins (more accurate estimates are more common)
    if (random < 0.3) {
      errorMargin = 0.15 // 30% chance - Low accuracy
    } else if (random < 0.8) {
      errorMargin = 0.08 // 50% chance - Medium accuracy  
    } else {
      errorMargin = 0.03 // 20% chance - High accuracy
    }

    const randomError = (Math.random() - 0.5) * 2 * errorMargin
    const estimateValue = Math.max(1, Math.round(actualCount * (1 + randomError)))
    
    // Calculate actual accuracy and assign appropriate confidence tag
    const actualAccuracy = 1 - Math.abs(estimateValue - actualCount) / actualCount
    
    if (actualAccuracy >= 0.97) { // Within 3%
      setConfidence('High')
    } else if (actualAccuracy >= 0.92) { // Within 8%
      setConfidence('Medium')
    } else { // Less than 92% accurate
      setConfidence('Low')
    }
    
    return estimateValue
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

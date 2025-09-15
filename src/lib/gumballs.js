export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateGumballs() {
  // Match the on-screen yellow box and GumballImage grid exactly
  const width = 400
  const height = 300
  const gumballSize = 12
  const spacing = 3
  const padding = 8

  const cols = Math.floor((width - padding * 2) / (gumballSize + spacing))
  const rows = Math.floor((height - padding * 2) / (gumballSize + spacing))
  const maxDisplayable = cols * rows // This is what we can physically render

  // Choose a target count from distinct ranges, then clamp to maxDisplayable
  const buckets = [
    { min: 20, max: 60 },     // dozens
    { min: 80, max: 150 },    // low hundreds
    { min: 200, max: 350 },   // mid
    { min: 380, max: 450 }    // high but within render capacity
  ]
  const chosen = buckets[randomInt(0, buckets.length - 1)]
  const targetCount = Math.min(randomInt(chosen.min, chosen.max), maxDisplayable)

  // Generate exactly targetCount positions on the same grid used by GumballImage
  const allPositions = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = padding + x * (gumballSize + spacing) + gumballSize / 2
      const py = padding + y * (gumballSize + spacing) + gumballSize / 2
      allPositions.push({ x: px, y: py })
    }
  }

  // Shuffle and take first targetCount
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = allPositions[i]
    allPositions[i] = allPositions[j]
    allPositions[j] = t
  }

  const balls = []
  for (let i = 0; i < targetCount; i++) {
    const p = allPositions[i]
    balls.push({ x: p.x, y: p.y, c: `hsl(${randomInt(0, 360)} 80% 60%)` })
  }

  return { width, height, balls, count: balls.length }
}

export function scoreForGuess(guess, trueCount, confidence = null) {
  const error = Math.abs(trueCount - guess)
  const percentageError = error / trueCount
  
  let baseScore;
  // More sensitive scoring system with larger differences
  if (percentageError <= 0.02) { // Within 2%
    baseScore = 100
  } else if (percentageError <= 0.05) { // Within 5%
    baseScore = 80
  } else if (percentageError <= 0.10) { // Within 10%
    baseScore = 60
  } else if (percentageError <= 0.15) { // Within 15%
    baseScore = 40
  } else if (percentageError <= 0.25) { // Within 25%
    baseScore = 20
  } else if (percentageError <= 0.40) { // Within 40%
    baseScore = 10
  } else if (percentageError <= 0.60) { // Within 60%
    baseScore = 5
  } else {
    baseScore = Math.max(1, Math.round(5 / (1 + percentageError)))
  }

  // If confidence is provided, factor it into the score.
  if (confidence !== null && confidence >= 0 && confidence <= 1) {
    // Confidence acts as a multiplier. 100% confidence = full score. 50% = half score.
    return Math.round(baseScore * confidence);
  }

  return baseScore;
}




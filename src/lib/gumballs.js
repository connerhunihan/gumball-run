export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateGumballs() {
  const width = 280
  const height = 280

  // Choose a target count from distinct ranges to create large swings
  // Ranges: dozens, hundreds, up to 800+
  const buckets = [
    { min: 20, max: 60 },     // dozens
    { min: 80, max: 150 },    // low hundreds
    { min: 200, max: 350 },   // mid
    { min: 400, max: 600 },   // high
    { min: 700, max: 900 }    // very high (800+ possible)
  ]
  const chosen = buckets[randomInt(0, buckets.length - 1)]
  const targetCount = randomInt(chosen.min, chosen.max)

  // Compute a radius that can fit targetCount circles in the given width/height
  // Use a square-ish grid and ensure at least radius 3 for visibility
  const gridSize = Math.ceil(Math.sqrt(targetCount))
  const computedRadius = Math.max(3, Math.floor(Math.min(width, height) / (gridSize * 2)))

  // Derive rows/cols from computed radius
  const cols = Math.max(1, Math.floor(width / (computedRadius * 2)))
  const rows = Math.max(1, Math.floor(height / (computedRadius * 2)))

  // Build all possible positions, then take exactly targetCount (or clamp to available)
  const allPositions = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      allPositions.push({
        x: x * computedRadius * 2 + computedRadius,
        y: y * computedRadius * 2 + computedRadius
      })
    }
  }

  // Shuffle positions for randomness
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = allPositions[i]
    allPositions[i] = allPositions[j]
    allPositions[j] = tmp
  }

  const finalCount = Math.min(targetCount, allPositions.length)
  const balls = []
  for (let i = 0; i < finalCount; i++) {
    const p = allPositions[i]
    balls.push({
      x: p.x,
      y: p.y,
      c: `hsl(${randomInt(0, 360)} 80% 60%)`
    })
  }

  return { width, height, balls, count: balls.length }
}

export function scoreForGuess(trueCount, guess) {
  const error = Math.abs(trueCount - guess)
  const percentageError = error / trueCount
  
  // More balanced scoring system (reduced by factor of 10)
  if (percentageError <= 0.05) { // Within 5%
    return 100
  } else if (percentageError <= 0.10) { // Within 10%
    return 80
  } else if (percentageError <= 0.15) { // Within 15%
    return 60
  } else if (percentageError <= 0.20) { // Within 20%
    return 40
  } else if (percentageError <= 0.30) { // Within 30%
    return 20
  } else if (percentageError <= 0.50) { // Within 50%
    return 10
  } else {
    return Math.max(1, Math.round(10 / (1 + percentageError)))
  }
}




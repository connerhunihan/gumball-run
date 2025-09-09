export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateGumballs() {
  const width = 280
  const height = 280
  const radius = 8
  const cols = Math.floor(width / (radius * 2))
  const rows = Math.floor(height / (radius * 2))
  const balls = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (Math.random() > 0.15) {
        balls.push({
          x: x * radius * 2 + radius,
          y: y * radius * 2 + radius,
          c: `hsl(${randomInt(0, 360)} 80% 60%)`,
        })
      }
    }
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




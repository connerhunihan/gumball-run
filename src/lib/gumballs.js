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
  const normalized = Math.max(1, Math.round(1000 / (1 + error)))
  return normalized
}




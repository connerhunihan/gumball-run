import React, { memo } from 'react'

const GumballImage = memo(function GumballImage({ count = 50, width = 400, height = 300 }) {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a55eea', '#26de81', '#ff4757', '#2ed573', '#1e90ff', '#ffa502']
  
  const gumballSize = 12
  const spacing = 3
  const padding = 8
  
  const gumballs = []
  let gumballsRendered = 0
  let y = padding + gumballSize / 2

  while (gumballsRendered < count && y < height - padding - gumballSize) {
    const availableWidth = width - padding * 2 - gumballSize
    const maxGumballsInRow = Math.floor(availableWidth / (gumballSize + spacing))
    const gumballsInRow = Math.max(5, Math.floor(Math.random() * maxGumballsInRow))
    const rowWidth = gumballsInRow * (gumballSize + spacing) - spacing
    const startX = (width - rowWidth) / 2

    for (let i = 0; i < gumballsInRow && gumballsRendered < count; i++) {
      const x = startX + i * (gumballSize + spacing) + gumballSize / 2
      const color = colors[gumballsRendered % colors.length]
      
      gumballs.push(
        <circle
          key={gumballsRendered}
          cx={x}
          cy={y}
          r={gumballSize / 2}
          fill={color}
          stroke="#000"
          strokeWidth="1"
        />
      )
      gumballsRendered++
    }
    
    y += gumballSize + spacing
  }
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        {gumballs}
      </svg>
    </div>
  )
})

export default GumballImage;

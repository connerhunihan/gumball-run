import React from 'react'

export default function GumballImage({ count = 50, width = 400, height = 300 }) {
  // Bright gumball colors
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a55eea', '#26de81', '#ff4757', '#2ed573', '#1e90ff', '#ffa502']
  
  // Calculate proportional representation
  const gumballSize = 12
  const spacing = 3
  const padding = 8
  
  const cols = Math.floor((width - padding * 2) / (gumballSize + spacing))
  const rows = Math.floor((height - padding * 2) / (gumballSize + spacing))
  const maxGumballs = cols * rows
  
  // Use the actual count, but handle overflow gracefully
  const displayCount = Math.min(count, maxGumballs)
  
  // Generate gumball positions
  const gumballs = []
  for (let i = 0; i < displayCount; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const x = padding + col * (gumballSize + spacing) + gumballSize / 2
    const y = padding + row * (gumballSize + spacing) + gumballSize / 2
    const color = colors[i % colors.length]
    
    gumballs.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={gumballSize / 2}
        fill={color}
        stroke="#000"
        strokeWidth="1"
      />
    )
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
}

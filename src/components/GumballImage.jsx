import React, { memo } from 'react'

const GumballImage = memo(function GumballImage({ machine, width = 400, height = 300 }) {
  if (!machine || !machine.balls) {
    return null; // or a loading state
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        {machine.balls.map((ball, index) => (
          <circle
            key={index}
            cx={ball.x}
            cy={ball.y}
            r={6} // gumballSize / 2
            fill={ball.c}
            stroke="#000"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  )
})

export default GumballImage;

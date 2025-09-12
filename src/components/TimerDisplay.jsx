import React from 'react'

export default function TimerDisplay({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#1BEDCA] border-4 border-black rounded-lg px-4 py-2 shadow-lg" style={{
        boxShadow: '8px 8px 0px 0px #000000'
      }}>
        <span className="text-black font-black text-lg" style={{
          fontFamily: 'Lexend Exa, sans-serif'
        }}>
          {timeString}
        </span>
      </div>
    </div>
  )
}
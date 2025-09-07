import { useEffect, useRef } from 'react'

export default function Timer({ seconds, onTick, onEnd, running = true }) {
  const intervalRef = useRef(null)
  useEffect(() => {
    if (!running) return
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      onTick?.()
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])
  useEffect(() => {
    if (seconds <= 0) {
      onEnd?.()
    }
  }, [seconds])
  return null
}




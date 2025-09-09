import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Individual pouring particle component
function PouringParticle({ position, velocity, radius, color, index, particlesRef, isPouring, pourComplete }) {
  const meshRef = useRef()
  const [hasSettled, setHasSettled] = useState(false)
  
  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current) return
    
    const particles = particlesRef.current
    const particle = particles[index]
    
    if (!particle) return
    
    // Only animate if pouring is active or particle hasn't settled
    if (isPouring || !hasSettled) {
      // Update position based on velocity
      particle.position.x += particle.velocity.x * delta
      particle.position.y += particle.velocity.y * delta
      particle.position.z += particle.velocity.z * delta
      
      // Update mesh position
      meshRef.current.position.copy(particle.position)
      
      // Check boundaries and bounce
      const bounds = 4 // Container bounds
      const floor = -3.5 // Floor level
      
      if (particle.position.x > bounds || particle.position.x < -bounds) {
        particle.velocity.x *= -0.6 // Damping
        particle.position.x = Math.max(-bounds, Math.min(bounds, particle.position.x))
      }
      
      if (particle.position.y < floor) {
        particle.velocity.y *= -0.3 // Bounce off floor
        particle.position.y = floor
        particle.velocity.x *= 0.8 // Friction
        particle.velocity.z *= 0.8
      }
      
      if (particle.position.z > bounds || particle.position.z < -bounds) {
        particle.velocity.z *= -0.6
        particle.position.z = Math.max(-bounds, Math.min(bounds, particle.position.z))
      }
      
      // Apply gravity
      particle.velocity.y -= 15 * delta // Stronger gravity for faster settling
      
      // Check if particle has settled (low velocity and near floor)
      if (Math.abs(particle.velocity.y) < 0.1 && particle.position.y <= floor + 0.5) {
        setHasSettled(true)
        particle.velocity.set(0, 0, 0) // Stop movement
      }
      
      // Collision detection with other particles
      for (let i = 0; i < particles.length; i++) {
        if (i === index) continue
        
        const other = particles[i]
        const distance = particle.position.distanceTo(other.position)
        const minDistance = particle.radius + other.radius
        
        if (distance < minDistance) {
          // Collision response
          const overlap = minDistance - distance
          const direction = new THREE.Vector3()
            .subVectors(particle.position, other.position)
            .normalize()
          
          // Separate particles
          const separation = direction.multiplyScalar(overlap * 0.3)
          particle.position.add(separation)
          other.position.sub(separation)
          
          // Exchange velocities (simplified elastic collision)
          const tempVel = particle.velocity.clone()
          particle.velocity.copy(other.velocity).multiplyScalar(0.6)
          other.velocity.copy(tempVel).multiplyScalar(0.6)
        }
      }
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[radius, 12, 12]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  )
}

// Main pouring particle simulation component
function PouringParticleSimulation({ 
  particleCount = 20, 
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a55eea', '#26de81'],
  sizeRange = [0.08, 0.25],
  containerSize = 8,
  onPourComplete
}) {
  const particlesRef = useRef([])
  const [isPouring, setIsPouring] = useState(false)
  const [pourComplete, setPourComplete] = useState(false)
  
  // Initialize particles for pouring
  const particles = useMemo(() => {
    const newParticles = []
    for (let i = 0; i < particleCount; i++) {
      // Start particles above the container for pouring effect
      newParticles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 2, // Narrower spread for pouring
          4 + (i * 0.1), // Staggered heights for pouring effect
          (Math.random() - 0.5) * 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5, // Slower initial velocity
          -2 - Math.random() * 2, // Downward velocity for pouring
          (Math.random() - 0.5) * 0.5
        ),
        radius: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    particlesRef.current = newParticles
    return newParticles
  }, [particleCount, colors, sizeRange, containerSize])
  
  // Start pouring animation
  useEffect(() => {
    setIsPouring(true)
    
    // Complete pouring after 1.5 seconds
    const timer = setTimeout(() => {
      setIsPouring(false)
      setPourComplete(true)
      if (onPourComplete) {
        onPourComplete()
      }
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [onPourComplete])
  
  return (
    <>
      {particles.map((particle, index) => (
        <PouringParticle
          key={index}
          position={particle.position}
          velocity={particle.velocity}
          radius={particle.radius}
          color={particle.color}
          index={index}
          particlesRef={particlesRef}
          isPouring={isPouring}
          pourComplete={pourComplete}
        />
      ))}
    </>
  )
}

// Wrapper component with Canvas
export default function PouringParticleSimulationWrapper({ 
  particleCount = 20, 
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a55eea', '#26de81'],
  sizeRange = [0.08, 0.25],
  containerSize = 8,
  className = "",
  style = {},
  onPourComplete
}) {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <PouringParticleSimulation
          particleCount={particleCount}
          colors={colors}
          sizeRange={sizeRange}
          containerSize={containerSize}
          onPourComplete={onPourComplete}
        />
      </Canvas>
    </div>
  )
}

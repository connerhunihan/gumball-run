import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Individual particle component
function Particle({ position, velocity, radius, color, index, particlesRef }) {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current) return
    
    const particles = particlesRef.current
    const particle = particles[index]
    
    if (!particle) return
    
    // Update position based on velocity
    particle.position.x += particle.velocity.x * delta
    particle.position.y += particle.velocity.y * delta
    particle.position.z += particle.velocity.z * delta
    
    // Update mesh position
    meshRef.current.position.copy(particle.position)
    
    // Check boundaries and bounce
    const bounds = 5 // Adjust based on your container size
    if (particle.position.x > bounds || particle.position.x < -bounds) {
      particle.velocity.x *= -0.8 // Damping factor
      particle.position.x = Math.max(-bounds, Math.min(bounds, particle.position.x))
    }
    if (particle.position.y > bounds || particle.position.y < -bounds) {
      particle.velocity.y *= -0.8
      particle.position.y = Math.max(-bounds, Math.min(bounds, particle.position.y))
    }
    if (particle.position.z > bounds || particle.position.z < -bounds) {
      particle.velocity.z *= -0.8
      particle.position.z = Math.max(-bounds, Math.min(bounds, particle.position.z))
    }
    
    // Apply gravity
    particle.velocity.y -= 9.8 * delta * 0.1
    
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
        const separation = direction.multiplyScalar(overlap * 0.5)
        particle.position.add(separation)
        other.position.sub(separation)
        
        // Exchange velocities (simplified elastic collision)
        const tempVel = particle.velocity.clone()
        particle.velocity.copy(other.velocity).multiplyScalar(0.8)
        other.velocity.copy(tempVel).multiplyScalar(0.8)
      }
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[radius, 16, 16]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  )
}

// Main particle simulation component
function ParticleSimulation({ 
  particleCount = 20, 
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
  sizeRange = [0.1, 0.3],
  containerSize = 10
}) {
  const particlesRef = useRef([])
  
  // Initialize particles
  const particles = useMemo(() => {
    const newParticles = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * containerSize * 0.8,
          (Math.random() - 0.5) * containerSize * 0.8,
          (Math.random() - 0.5) * containerSize * 0.8
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        radius: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    particlesRef.current = newParticles
    return newParticles
  }, [particleCount, colors, sizeRange, containerSize])
  
  return (
    <>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          position={particle.position}
          velocity={particle.velocity}
          radius={particle.radius}
          color={particle.color}
          index={index}
          particlesRef={particlesRef}
        />
      ))}
    </>
  )
}

// Wrapper component with Canvas
export default function ParticleSimulationWrapper({ 
  particleCount = 20, 
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
  sizeRange = [0.1, 0.3],
  containerSize = 10,
  className = "",
  style = {}
}) {
  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <ParticleSimulation
          particleCount={particleCount}
          colors={colors}
          sizeRange={sizeRange}
          containerSize={containerSize}
        />
      </Canvas>
    </div>
  )
}

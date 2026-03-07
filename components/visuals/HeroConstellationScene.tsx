'use client'

import React, { Suspense, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'

const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
)

/**
 * HeroConstellationScene
 *
 * A subtle WebGL constellation of particles behind the hero section.
 * Uses native Three.js points with BufferGeometry for reliability.
 */
export function HeroConstellationScene() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-soft-light">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.3} />
          <ConstellationParticles />
        </Canvas>
      </Suspense>
    </div>
  )
}

function ConstellationParticles() {
  const count = 500
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pts[i * 3 + 2] = r * Math.cos(phi)
    }
    return pts
  }, [])

  const pointsRef = useRef<THREE.Points>(null)

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#C4A882"
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  )
}


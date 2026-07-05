import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial,
  NormalBlending,
  type Points,
} from 'three'
import { fxTextures } from './gradientTextures'

/** Warm light pool on the floor. Additive, sorted above the floor. */
export function FloorPool({
  position,
  radius = 1.6,
  tint = '#ffc79a',
  opacity = 0.5,
}: {
  position: [number, number, number]
  radius?: number
  tint?: string
  opacity?: number
}) {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: fxTextures().pool,
        color: tint,
        transparent: true,
        opacity,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [tint, opacity],
  )
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={9}>
      <planeGeometry args={[radius * 2, radius * 2]} />
    </mesh>
  )
}

/** Fake volumetric cone hanging from a lamp head down to the surface. */
export function LightCone({
  position,
  topRadius = 0.08,
  bottomRadius = 0.85,
  height = 2.2,
  opacity = 0.09,
}: {
  position: [number, number, number]
  topRadius?: number
  bottomRadius?: number
  height?: number
  opacity?: number
}) {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: fxTextures().cone,
        color: '#ffd9a8',
        transparent: true,
        opacity,
        blending: AdditiveBlending,
        depthWrite: false,
        side: 2,
      }),
    [opacity],
  )
  return (
    <mesh position={position} material={mat} renderOrder={10}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 20, 1, true]} />
    </mesh>
  )
}

/** Soft dark blob standing in for contact shadows / AO under furniture. */
export function ShadowBlob({
  position,
  width = 2,
  depth = 1.2,
  opacity = 0.55,
}: {
  position: [number, number, number]
  width?: number
  depth?: number
  opacity?: number
}) {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: fxTextures().blob,
        transparent: true,
        opacity,
        blending: NormalBlending,
        depthWrite: false,
      }),
    [opacity],
  )
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={8}>
      <planeGeometry args={[width, depth]} />
    </mesh>
  )
}

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Slow-drifting dust in the lamp light. One draw call. */
export function DustMotes({ count = 220 }: { count?: number }) {
  const ref = useRef<Points>(null)
  const geometry = useMemo(() => {
    const g = new BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -4 + Math.random() * 8
      pos[i * 3 + 1] = 0.3 + Math.random() * 2.6
      pos[i * 3 + 2] = -36 + Math.random() * 35
    }
    g.setAttribute('position', new Float32BufferAttribute(pos, 3))
    return g
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current || REDUCED_MOTION) return
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.02) * 0.05
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.11) * 0.06
  })

  return (
    <points ref={ref} geometry={geometry} renderOrder={11}>
      <pointsMaterial
        color="#ffdcb0"
        size={0.02}
        transparent
        opacity={0.32}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

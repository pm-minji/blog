import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  CanvasTexture,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  type InstancedMesh,
} from 'three'
import * as M from '../materials'

/** Structural rhythm overhead — parallax cue while travelling the hall. */
export function CeilingBeams() {
  const ref = useRef<InstancedMesh>(null)
  const zs = useMemo(() => [2, -6, -14, -22, -30, -38], [])
  useFrame(() => {
    const mesh = ref.current
    if (!mesh || mesh.userData.placed) return
    const tmp = new Object3D()
    zs.forEach((z, i) => {
      tmp.position.set(0, 3.42, z)
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.userData.placed = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 6]} material={M.woodDark} frustumCulled={false}>
      <boxGeometry args={[9.2, 0.2, 0.32]} />
    </instancedMesh>
  )
}

/** Electrical conduit along the right wall — industrial texture for cheap. */
export function WallConduit() {
  return (
    <group>
      <mesh position={[4.3, 2.72, -17]} rotation={[Math.PI / 2, 0, 0]} material={M.metalMid}>
        <cylinderGeometry args={[0.035, 0.035, 44, 6]} />
      </mesh>
      {[-6, -18.5, -30].map((z) => (
        <mesh key={z} position={[4.28, 2.72, z]} material={M.metalDark}>
          <boxGeometry args={[0.14, 0.22, 0.22]} />
        </mesh>
      ))}
    </group>
  )
}

/** Worn painted guide line leading visitors down the hall. */
export function GuideLine() {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: M.ACCENT,
        transparent: true,
        opacity: 0.11,
        depthWrite: false,
      }),
    [],
  )
  return (
    <mesh position={[0.55, 0.007, -15]} rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={7}>
      <planeGeometry args={[0.14, 44]} />
    </mesh>
  )
}

function stripeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#17140f'
  ctx.fillRect(0, 0, 64, 64)
  ctx.strokeStyle = '#b3502a'
  ctx.lineWidth = 12
  for (let i = -64; i < 128; i += 32) {
    ctx.beginPath()
    ctx.moveTo(i, 64)
    ctx.lineTo(i + 64, 0)
    ctx.stroke()
  }
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.wrapS = t.wrapT = 1000
  t.repeat.set(9, 1)
  return t
}

/** Hazard stripes at the door threshold. */
export function ThresholdStripes() {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: stripeTexture(),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    [],
  )
  return (
    <mesh position={[0, 0.008, 4.45]} rotation={[-Math.PI / 2, 0, 0]} material={mat} renderOrder={7}>
      <planeGeometry args={[6, 0.55]} />
    </mesh>
  )
}

const paper = new MeshStandardMaterial({ color: '#cfcabf', roughness: 1 })

/** Loose printouts scattered where someone actually works. */
export function ScatteredPapers() {
  const ref = useRef<InstancedMesh>(null)
  const placements: Array<[number, number, number, number]> = useMemo(
    () => [
      [0.9, 0.004, -1.6, 0.4],
      [-0.7, 0.004, -3.4, 2.6],
      [2.9, 0.755, -10.1, 1.2],
      [2.6, 0.004, -11.4, 0.8],
      [-2.9, 0.755, -18.9, 2.1],
      [3.0, 0.755, -26.2, 2.9],
      [-2.4, 0.004, -33.6, 1.7],
      [-0.9, 0.004, -35.6, 0.3],
    ],
    [],
  )
  useFrame(() => {
    const mesh = ref.current
    if (!mesh || mesh.userData.placed) return
    const tmp = new Object3D()
    placements.forEach(([x, y, z, rot], i) => {
      tmp.position.set(x, y, z)
      tmp.rotation.set(-Math.PI / 2, 0, rot)
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.userData.placed = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 8]} material={paper} frustumCulled={false}>
      <planeGeometry args={[0.21, 0.3]} />
    </instancedMesh>
  )
}

export function Dressing() {
  return (
    <group>
      <CeilingBeams />
      <WallConduit />
      <GuideLine />
      <ThresholdStripes />
      <ScatteredPapers />
    </group>
  )
}

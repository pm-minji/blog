import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  type Group,
  type Mesh,
  type PointLight,
  type Texture,
} from 'three'
import * as M from '../materials'
import { LightCone } from '../fx/Fakes'

export const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Monitor on a stand. Screen is self-lit (the light source of each desk). */
export function Monitor({
  screen,
  breathePhase = 0,
  cursor = false,
}: {
  screen: Texture
  breathePhase?: number
  cursor?: boolean
}) {
  const mat = useMemo(
    () => new MeshBasicMaterial({ map: screen, toneMapped: false }),
    [screen],
  )
  const cursorRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!REDUCED_MOTION) {
      const k = 0.965 + 0.035 * Math.sin(t * 1.3 + breathePhase)
      mat.color.setScalar(k)
    }
    if (cursorRef.current) cursorRef.current.visible = REDUCED_MOTION || t % 1.1 < 0.6
  })
  return (
    <group>
      <mesh position={[0, 0.47, -0.015]} material={M.plasticBlack}>
        <boxGeometry args={[0.66, 0.44, 0.035]} />
      </mesh>
      <mesh position={[0, 0.47, 0.004]} material={mat}>
        <planeGeometry args={[0.6, 0.375]} />
      </mesh>
      {cursor ? (
        <mesh ref={cursorRef} position={[-0.09, 0.395, 0.006]}>
          <planeGeometry args={[0.008, 0.026]} />
          <meshBasicMaterial color="#ffd9a8" toneMapped={false} />
        </mesh>
      ) : null}
      <mesh position={[0, 0.14, 0]} material={M.plasticBlack}>
        <cylinderGeometry args={[0.028, 0.028, 0.22, 8]} />
      </mesh>
      <mesh position={[0, 0.02, 0.02]} material={M.plasticBlack}>
        <boxGeometry args={[0.22, 0.03, 0.16]} />
      </mesh>
    </group>
  )
}

/** Articulated desk lamp. Optionally flickers (with its paired point light). */
export function DeskLamp({
  flicker = false,
  light,
  headColor = '#ffd9a8',
}: {
  flicker?: boolean
  light?: React.RefObject<PointLight | null>
  headColor?: string
}) {
  const bulbMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#2c2a26',
        emissive: new Color(headColor),
        emissiveIntensity: 1,
        roughness: 0.8,
      }),
    [headColor],
  )
  const state = useRef({ level: 1, dropUntil: 0, base: 0 })
  useFrame(({ clock }) => {
    if (!flicker || REDUCED_MOTION) return
    const t = clock.elapsedTime
    const s = state.current
    if (t > s.dropUntil && Math.random() < 0.004) s.dropUntil = t + 0.09
    const target = t < s.dropUntil ? 0.15 : 0.85 + 0.25 * Math.sin(t * 17) * Math.random()
    s.level += (target - s.level) * 0.35
    bulbMat.emissiveIntensity = s.level
    if (light?.current) {
      if (s.base === 0) s.base = light.current.intensity
      light.current.intensity = s.base * (0.45 + 0.55 * s.level)
    }
  })
  return (
    <group>
      <mesh position={[0, 0.02, 0]} material={M.metalDark}>
        <cylinderGeometry args={[0.07, 0.09, 0.035, 10]} />
      </mesh>
      <mesh position={[0.06, 0.19, 0]} rotation={[0, 0, -0.5]} material={M.metalMid}>
        <cylinderGeometry args={[0.012, 0.012, 0.36, 6]} />
      </mesh>
      <mesh position={[0.21, 0.34, 0]} rotation={[0, 0, -2.2]} material={M.metalDark}>
        <coneGeometry args={[0.09, 0.16, 12, 1, true]} />
      </mesh>
      <mesh position={[0.24, 0.31, 0]} material={bulbMat}>
        <sphereGeometry args={[0.035, 8, 6]} />
      </mesh>
    </group>
  )
}

/** Ceiling pendant lamp with a gentle sway. */
export function PendantLamp({ position }: { position: [number, number, number] }) {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current || REDUCED_MOTION) return
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.018
  })
  const [x, y, z] = position
  const drop = 0.55
  return (
    <group ref={group} position={[x, y, z]}>
      <mesh position={[0, -drop / 2, 0]} material={M.metalDark}>
        <cylinderGeometry args={[0.008, 0.008, drop, 5]} />
      </mesh>
      <mesh position={[0, -drop, 0]} material={M.metalDark}>
        <coneGeometry args={[0.17, 0.17, 14, 1, true]} />
      </mesh>
      <mesh position={[0, -drop - 0.04, 0]} material={M.bulbWarm}>
        <sphereGeometry args={[0.045, 8, 6]} />
      </mesh>
      <LightCone position={[0, -drop - 1.15, 0]} topRadius={0.16} bottomRadius={0.8} height={2.1} />
    </group>
  )
}

/** Sagging string of fairy lights with a soft twinkle. */
export function StringLights({
  from,
  to,
  count = 12,
  sag = 0.35,
}: {
  from: [number, number, number]
  to: [number, number, number]
  count?: number
  sag?: number
}) {
  const ref = useRef<InstancedMesh>(null)
  const pts = useMemo(() => {
    const arr: Array<[number, number, number]> = []
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count
      arr.push([
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * sag,
        from[2] + (to[2] - from[2]) * t,
      ])
    }
    return arr
  }, [from, to, count, sag])

  const base = useMemo(() => new Color('#ffd9a8'), [])
  const dim = useMemo(() => new Color('#8a6c4c'), [])
  const tmp = useMemo(() => new Object3D(), [])

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    if (mesh.userData.placed !== true) {
      pts.forEach((p, i) => {
        tmp.position.set(p[0], p[1], p[2])
        tmp.updateMatrix()
        mesh.setMatrixAt(i, tmp.matrix)
        mesh.setColorAt(i, base)
      })
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.userData.placed = true
    }
    if (REDUCED_MOTION) return
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.8 + i * 2.1)
      tmpColor.copy(dim).lerp(base, 0.35 + 0.65 * k)
      mesh.setColorAt(i, tmpColor)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.022, 6, 5]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
const tmpColor = new Color()

/** Three distinct prototype silhouettes, one per project desk. */
export function PrototypeObject({ variant }: { variant: 'gadget' | 'device' | 'box' }) {
  if (variant === 'gadget') {
    return (
      <group>
        <mesh position={[0, 0.03, 0]} material={M.plasticWhite}>
          <cylinderGeometry args={[0.09, 0.11, 0.06, 12]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} material={M.accentPaint}>
          <cylinderGeometry args={[0.05, 0.075, 0.13, 10]} />
        </mesh>
        <mesh position={[0, 0.215, 0]} material={M.plasticWhite}>
          <sphereGeometry args={[0.05, 10, 8]} />
        </mesh>
      </group>
    )
  }
  if (variant === 'device') {
    return (
      <group>
        <mesh position={[0, 0.045, 0]} material={M.plasticBlack}>
          <boxGeometry args={[0.22, 0.09, 0.15]} />
        </mesh>
        <mesh position={[0.05, 0.11, 0]} material={M.metalMid}>
          <boxGeometry args={[0.1, 0.05, 0.1]} />
        </mesh>
        <mesh position={[-0.07, 0.17, 0]} material={M.metalMid}>
          <cylinderGeometry args={[0.004, 0.004, 0.16, 4]} />
        </mesh>
        <mesh position={[-0.07, 0.26, 0]} material={M.bulbWarm}>
          <sphereGeometry args={[0.012, 6, 5]} />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0.09, 0]} material={M.cardboard}>
        <boxGeometry args={[0.2, 0.18, 0.14]} />
      </mesh>
      <mesh position={[0, 0.185, 0]} material={M.accentPaint}>
        <boxGeometry args={[0.21, 0.012, 0.15]} />
      </mesh>
      <mesh position={[0.16, 0.04, 0.02]} rotation={[0, 0.4, 0]} material={M.plasticWhite}>
        <boxGeometry args={[0.09, 0.08, 0.06]} />
      </mesh>
    </group>
  )
}

/** Coffee mug, accent-colored — sits on Minji's desk. */
export function Mug() {
  return (
    <group>
      <mesh position={[0, 0.045, 0]} material={M.accentPaint}>
        <cylinderGeometry args={[0.04, 0.036, 0.09, 10]} />
      </mesh>
      <mesh position={[0.05, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.accentPaint}>
        <torusGeometry args={[0.024, 0.008, 6, 10, Math.PI]} />
      </mesh>
    </group>
  )
}

/** Office chair, turned as if just vacated. */
export function OfficeChair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.46, 0]} material={M.fabric}>
        <boxGeometry args={[0.42, 0.07, 0.4]} />
      </mesh>
      <mesh position={[0, 0.75, -0.19]} rotation={[-0.12, 0, 0]} material={M.fabric}>
        <boxGeometry args={[0.4, 0.55, 0.06]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={M.metalDark}>
        <cylinderGeometry args={[0.025, 0.025, 0.32, 6]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.metalDark}>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 5]} />
      </mesh>
    </group>
  )
}

/** Cardboard box pile — one InstancedMesh for all boxes in the hall. */
export function BoxPiles() {
  const ref = useRef<InstancedMesh>(null)
  const placements: Array<[number, number, number, number, number]> = useMemo(
    () => [
      [-3.8, 0.28, -5.2, 0.25, 0.56],
      [-3.55, 0.22, -5.9, 0.9, 0.44],
      [-3.7, 0.73, -5.4, 0.5, 0.34],
      [3.8, 0.26, -21.6, 0.15, 0.52],
      [3.6, 0.2, -30.5, 0.72, 0.4],
      [-3.75, 0.24, -31.2, 0.4, 0.48],
    ],
    [],
  )
  useFrame(() => {
    const mesh = ref.current
    if (!mesh || mesh.userData.placed) return
    const tmp = new Object3D()
    placements.forEach(([x, y, z, rot, s], i) => {
      tmp.position.set(x, y, z)
      tmp.rotation.set(0, rot, 0)
      tmp.scale.setScalar(s / 0.5)
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.userData.placed = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 6]} material={M.cardboard} frustumCulled={false}>
      <boxGeometry args={[0.55, 0.5, 0.55]} />
    </instancedMesh>
  )
}

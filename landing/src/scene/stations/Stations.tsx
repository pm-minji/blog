import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import {
  CatmullRomCurve3,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
  type Mesh,
  type PointLight,
} from 'three'
import * as M from '../materials'
import { useSrgbTexture } from '../textures'
import { FloorPool, LightCone, ShadowBlob } from '../fx/Fakes'
import { DeskLamp, Monitor, Mug, OfficeChair, PendantLamp, PrototypeObject, StringLights, REDUCED_MOTION } from '../props/Props'

/** Desk-to-floor power cable — the small mess that makes a desk look used. */
function Cable({ points }: { points: Array<[number, number, number]> }) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)))
    return new TubeGeometry(curve, 14, 0.011, 5, false)
  }, [points])
  return <mesh geometry={geometry} material={M.plasticBlack} />
}

/** Station 1 — whiteboard on a rolling stand, lit by a swaying pendant. */
export function WhiteboardStation({ z }: { z: number }) {
  const tex = useSrgbTexture('whiteboard')
  const boardMat = useMemo(() => new MeshBasicMaterial({ map: tex, toneMapped: false, color: '#b9b6ad' }), [tex])
  return (
    <group position={[0, 0, z]}>
      <RoundedBox
        args={[2.56, 1.76, 0.05]}
        radius={0.018}
        smoothness={2}
        position={[0, 1.72, -0.02]}
        rotation={[-0.05, 0, 0]}
        material={M.metalMid}
      />
      <mesh position={[0, 1.72, 0.011]} rotation={[-0.05, 0, 0]} material={boardMat}>
        <planeGeometry args={[2.4, 1.6]} />
      </mesh>
      <mesh position={[0, 0.86, 0.05]} material={M.metalMid}>
        <boxGeometry args={[2.2, 0.05, 0.12]} />
      </mesh>
      {[-1.1, 1.1].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.85, 0]} rotation={[0, 0, x > 0 ? -0.06 : 0.06]} material={M.metalDark}>
            <boxGeometry args={[0.06, 1.7, 0.06]} />
          </mesh>
          <mesh position={[x, 0.03, 0]} material={M.metalDark}>
            <boxGeometry args={[0.09, 0.06, 0.5]} />
          </mesh>
        </group>
      ))}
      <PendantLamp position={[0, 3.58, 0.15]} />
      <FloorPool position={[0, 0.012, 0.2]} radius={1.7} opacity={0.4} />
      <ShadowBlob position={[0, 0.008, 0]} width={2.8} depth={1} />
    </group>
  )
}

export interface DeskConfig {
  z: number
  side: 'left' | 'right'
  screen: 'screenA' | 'screenB' | 'screenC'
  prototype: 'gadget' | 'device' | 'box'
  flicker?: boolean
  cool?: boolean
}

/** Stations 2-4 — a maker desk against the wall, its monitor glowing. */
export function ProjectDesk({ z, side, screen, prototype, flicker = false, cool = false }: DeskConfig) {
  const x = side === 'right' ? 3.35 : -3.35
  const rotY = side === 'right' ? -Math.PI / 2 + 0.16 : Math.PI / 2 - 0.16
  const tex = useSrgbTexture(screen)
  const lightRef = useRef<PointLight>(null)
  const lightColor = cool ? '#bccdf2' : '#ffc396'
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <pointLight
        ref={lightRef}
        position={[0, 1.9, 0.4]}
        color={lightColor}
        intensity={cool ? 14 : 18}
        distance={6.5}
        decay={2}
      />
      <RoundedBox args={[1.7, 0.06, 0.72]} radius={0.015} smoothness={2} position={[0, 0.74, 0]} material={M.wood} />
      {[-0.78, 0.78].map((px) => (
        <mesh key={px} position={[px, 0.37, 0]} material={M.woodDark}>
          <boxGeometry args={[0.05, 0.74, 0.66]} />
        </mesh>
      ))}
      <group position={[-0.1, 0.77, -0.08]}>
        <Monitor screen={tex} breathePhase={z} />
      </group>
      <Cable
        points={[
          [-0.1, 0.72, -0.3],
          [0.12, 0.32, -0.4],
          [-0.5, 0.015, -0.34],
        ]}
      />
      <mesh position={[-0.08, 0.785, 0.24]} rotation={[0, 0.06, 0]} material={M.plasticBlack}>
        <boxGeometry args={[0.42, 0.018, 0.14]} />
      </mesh>
      <group position={[0.62, 0.77, -0.12]} rotation={[0, -0.6, 0]}>
        <DeskLamp flicker={flicker} light={lightRef} headColor={cool ? '#dbe6ff' : '#ffd9a8'} />
      </group>
      <group position={[-0.62, 0.77, 0.14]} rotation={[0, 0.9, 0]}>
        <PrototypeObject variant={prototype} />
      </group>
      <mesh position={[0, 1.85, -0.42]} material={M.woodDark}>
        <boxGeometry args={[1.5, 0.045, 0.26]} />
      </mesh>
      {[-0.5, 0.05, 0.42].map((px, i) => (
        <mesh key={px} position={[px, 1.94, -0.42]} rotation={[0, 0, (i - 1) * 0.06]} material={i === 1 ? M.accentPaint : M.plasticWhite}>
          <boxGeometry args={[0.045, 0.17, 0.2]} />
        </mesh>
      ))}
      <FloorPool position={[0, 0.012, 0.3]} radius={1.9} tint={cool ? '#9db4e8' : '#ffc79a'} opacity={0.34} />
      <ShadowBlob position={[0, 0.008, 0]} width={2.2} depth={1.3} />
    </group>
  )
}

/** Station 5 — 민지's own corner: corkboard, clock at 2:47, warm string lights. */
export function MinjiCorner({ z }: { z: number }) {
  const screen = useSrgbTexture('screenMinji')
  const cork = useSrgbTexture('corkboard')
  const clock = useSrgbTexture('clock')
  const plate = useSrgbTexture('nameplate')
  const sky = useSrgbTexture('skylight')
  const lightRef = useRef<PointLight>(null)
  const corkMat = useMemo(() => new MeshBasicMaterial({ map: cork, toneMapped: false, color: '#c9b8a2' }), [cork])
  const skyMat = useMemo(() => new MeshBasicMaterial({ map: sky, toneMapped: false, color: '#c8cfe2' }), [sky])
  const clockMat = useMemo(() => new MeshBasicMaterial({ map: clock, toneMapped: false }), [clock])
  const plateMat = useMemo(() => new MeshBasicMaterial({ map: plate, toneMapped: false, color: '#d8d2c6' }), [plate])
  const colonRef = useRef<Mesh>(null)
  useFrame(({ clock: c }) => {
    if (colonRef.current) colonRef.current.visible = REDUCED_MOTION || c.elapsedTime % 2 < 1.2
  })
  return (
    <group position={[0, 0, z]}>
      <pointLight ref={lightRef} position={[-1.4, 2.0, 0.3]} color="#ffb37a" intensity={22} distance={7} decay={2} />

      <group position={[-1.6, 0, -0.7]} rotation={[0, 0.7, 0]}>
        <RoundedBox args={[1.9, 0.06, 0.78]} radius={0.015} smoothness={2} position={[0, 0.74, 0]} material={M.wood} />
        <Cable
          points={[
            [0.05, 0.72, -0.32],
            [0.3, 0.3, -0.44],
            [-0.35, 0.015, -0.4],
          ]}
        />
        {[-0.88, 0.88].map((px) => (
          <mesh key={px} position={[px, 0.37, 0]} material={M.woodDark}>
            <boxGeometry args={[0.05, 0.74, 0.7]} />
          </mesh>
        ))}
        <group position={[0.05, 0.77, -0.1]}>
          <Monitor screen={screen} cursor breathePhase={2} />
        </group>
        <mesh position={[0.02, 0.79, 0.26]} rotation={[0, -0.05, 0]} material={M.plasticBlack}>
          <boxGeometry args={[0.42, 0.018, 0.14]} />
        </mesh>
        <group position={[0.78, 0.77, -0.18]} rotation={[0, -2.2, 0]}>
          <DeskLamp />
        </group>
        <group position={[-0.55, 0.77, 0.2]}>
          <Mug />
        </group>
        <mesh position={[0.1, 0.7, 0.39]} rotation={[-0.18, 0, 0]} material={plateMat}>
          <planeGeometry args={[0.26, 0.065]} />
        </mesh>
      </group>

      <OfficeChair position={[-1.05, 0, 0.5]} rotationY={2.9} />

      <mesh position={[-1.35, 1.95, -1.28]} rotation={[0, 0.08, 0]} material={corkMat}>
        <planeGeometry args={[1.6, 1.2]} />
      </mesh>
      <mesh position={[0.05, 2.5, -1.31]} material={clockMat}>
        <planeGeometry args={[0.5, 0.25]} />
      </mesh>
      <mesh ref={colonRef} position={[0.017, 2.503, -1.305]}>
        <planeGeometry args={[0.02, 0.11]} />
        <meshBasicMaterial color="#ffb14e" toneMapped={false} />
      </mesh>

      <group position={[-1.5, 0, -0.4]}>
        <mesh position={[0, 3.56, 0]} rotation={[Math.PI / 2, 0, 0]} material={skyMat}>
          <planeGeometry args={[1.5, 1.1]} />
        </mesh>
        {[
          [0, 0.79, 1.62, 0.12],
          [0, -0.79, 1.62, 0.12],
          [0.81, 0, 0.12, 1.1],
          [-0.81, 0, 0.12, 1.1],
        ].map(([fx, fz, fw, fd], i) => (
          <mesh key={i} position={[fx, 3.54, fz]} material={M.metalDark}>
            <boxGeometry args={[fw, 0.08, fd]} />
          </mesh>
        ))}
        <LightCone
          position={[0, 1.85, 0]}
          topRadius={0.5}
          bottomRadius={1.05}
          height={3.4}
          opacity={0.05}
          color="#bcd0f5"
        />
        <FloorPool position={[0, 0.014, 0]} radius={1.25} tint="#9db4e8" opacity={0.3} />
      </group>
      <StringLights from={[-3.2, 2.9, -1.1]} to={[0.9, 3.15, -1.1]} count={14} sag={0.4} />
      <mesh position={[-0.9, 0.006, 0.2]} rotation={[-Math.PI / 2, 0, 0.2]} material={M.rugFabric}>
        <planeGeometry args={[2.1, 1.5]} />
      </mesh>
      <FloorPool position={[-1.3, 0.012, 0.1]} radius={2.1} opacity={0.5} />
      <ShadowBlob position={[-1.5, 0.009, -0.6]} width={2.4} depth={1.4} />
    </group>
  )
}

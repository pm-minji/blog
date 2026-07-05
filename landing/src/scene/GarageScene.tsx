import { Suspense, lazy, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Blockout } from './Blockout'
import { CameraRig } from './CameraRig'
import { CAMERA_STOPS } from '../content/stations'

const Perf = import.meta.env.DEV
  ? lazy(() => import('r3f-perf').then((m) => ({ default: m.Perf })))
  : null

export function GarageScene({ progressRef }: { progressRef: RefObject<number> }) {
  const start = CAMERA_STOPS[0]
  return (
    <Canvas
      className="garage-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [start.x, start.y, start.z], fov: 55, near: 0.1, far: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#1c1c20']} />
      <fog attach="fog" args={['#1c1c20', 8, 30]} />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#fff2e3', '#2b2b30', 0.4]} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} />
      <Blockout />
      <CameraRig progressRef={progressRef} />
      {Perf ? (
        <Suspense fallback={null}>
          <Perf position="top-left" />
        </Suspense>
      ) : null}
    </Canvas>
  )
}

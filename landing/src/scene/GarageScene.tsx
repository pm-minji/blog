import { Suspense, lazy, useEffect, type RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Workshop } from './Workshop'
import { CameraRig } from './CameraRig'
import { CAMERA_STOPS } from '../content/stations'

/**
 * Exposes a manual frame driver on window so external tooling (screenshot
 * verification in hidden tabs, where rAF is paused) can pump frames.
 * No-op for normal visitors.
 */
function FrameBridge() {
  const advance = useThree((s) => s.advance)
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.__r3fAdvance = (n = 1) => {
      for (let i = 0; i < n; i++) advance(performance.now() / 1000 + i * 0.016, true)
    }
    return () => {
      delete w.__r3fAdvance
    }
  }, [advance])
  return null
}

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
      <FrameBridge />
      <color attach="background" args={['#141317']} />
      <fog attach="fog" args={['#141317', 6, 26]} />
      <ambientLight color="#26221f" intensity={0.9} />
      <hemisphereLight args={['#35302c', '#101014', 0.5]} />
      <Suspense fallback={null}>
        <Workshop />
      </Suspense>
      <CameraRig progressRef={progressRef} />
      {Perf ? (
        <Suspense fallback={null}>
          <Perf position="top-left" />
        </Suspense>
      ) : null}
    </Canvas>
  )
}

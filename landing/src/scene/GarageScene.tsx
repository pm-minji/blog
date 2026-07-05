import { Suspense, lazy, useEffect, type RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { Workshop } from './Workshop'
import { CameraRig } from './CameraRig'
import { CAMERA_STOPS } from '../content/stations'

const Perf = import.meta.env.DEV
  ? lazy(() => import('r3f-perf').then((m) => ({ default: m.Perf })))
  : null

const DESKTOP = typeof window !== 'undefined' && window.innerWidth >= 700

/**
 * Exposes a manual frame driver + renderer stats on window so external
 * tooling (screenshot verification in hidden tabs, where rAF is paused)
 * can pump frames and audit draw calls. No-op for normal visitors.
 */
function FrameBridge() {
  const advance = useThree((s) => s.advance)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.__r3fAdvance = (n = 1) => {
      for (let i = 0; i < n; i++) advance(performance.now() / 1000 + i * 0.016, true)
    }
    w.__glInfo = () => ({
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      textures: gl.info.memory.textures,
      geometries: gl.info.memory.geometries,
    })
    return () => {
      delete w.__r3fAdvance
      delete w.__glInfo
    }
  }, [advance, gl])
  return null
}

export function GarageScene({ progressRef }: { progressRef: RefObject<number> }) {
  const start = CAMERA_STOPS[0]
  return (
    <Canvas
      className="garage-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [start.x, start.y, start.z], fov: 55, near: 0.1, far: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08
      }}
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
      <EffectComposer multisampling={DESKTOP ? 4 : 0}>
        <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.85} radius={0.72} />
        <Noise premultiply opacity={0.055} />
        <Vignette eskil={false} offset={0.26} darkness={0.72} />
      </EffectComposer>
      {Perf ? (
        <Suspense fallback={null}>
          <Perf position="top-left" />
        </Suspense>
      ) : null}
    </Canvas>
  )
}

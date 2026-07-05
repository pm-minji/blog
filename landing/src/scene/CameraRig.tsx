import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { CAMERA_STOPS, LOOK_STOPS } from '../content/stations'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Drives the camera along a CatmullRom rail from scroll progress.
 *
 * Uses getPoint (uniform parameter), not getPointAt (arc length): uniform
 * parameters hit control points exactly at i/(n-1), which is what keeps
 * snap fractions, station cards, and camera framing in perfect agreement.
 */
export function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const posCurve = useMemo(
    () => new CatmullRomCurve3(CAMERA_STOPS, false, 'centripetal'),
    [],
  )
  const lookCurve = useMemo(
    () => new CatmullRomCurve3(LOOK_STOPS, false, 'centripetal'),
    [],
  )
  const damped = useRef(0)
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])

  // Portrait screens have a much narrower horizontal frustum for the same
  // vertical fov — widen it so station framing survives on phones.
  const { size, camera } = useThree()
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    camera.fov = size.width < size.height ? 68 : 55
    camera.updateProjectionMatrix()
  }, [size, camera])

  useFrame(({ camera }, delta) => {
    damped.current = REDUCED_MOTION
      ? progressRef.current
      : MathUtils.damp(damped.current, progressRef.current, 2.5, delta)
    posCurve.getPoint(damped.current, pos)
    lookCurve.getPoint(damped.current, look)
    camera.position.copy(pos)
    camera.lookAt(look)
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__camDebug = {
        t: damped.current,
        target: progressRef.current,
        pos: camera.position.toArray(),
      }
    }
  })

  return null
}

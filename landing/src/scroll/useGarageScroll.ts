import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { STOP_COUNT, stopFraction } from '../content/stations'

const SEGMENTS = STOP_COUNT - 1

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const maxScroll = () =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

/**
 * Maps document scroll to rail progress [0..1] with a plain passive scroll
 * listener (no scroll-library magic — guaranteed behavior on iOS Safari).
 *
 * - `progressRef` updates on every scroll tick without re-rendering React;
 *   the camera rig reads it inside useFrame.
 * - `activeStation` is -1 while outside the door, otherwise the index into
 *   STATIONS nearest to the current stop. While a programmatic tween owns
 *   the scroll the index is frozen (dot nav sets its destination eagerly),
 *   so multi-segment jumps don't flash every intermediate card.
 * - Snap and dot navigation share one gsap tween slot (tweenRef) so they can
 *   never fight each other. User input kills the tween: wheel/touch/key via
 *   listeners, scrollbar drags via an expected-position check in onScroll.
 * - Resize/rotation re-anchors scroll to the current progress so the camera,
 *   card, and scrollbar never disagree after the viewport changes.
 * - prefers-reduced-motion: tweens become instant jumps.
 */
export function useGarageScroll() {
  const progressRef = useRef(0)
  const [activeStation, setActiveStation] = useState(-1)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const expectedY = useRef(-1)
  const timerRef = useRef(0)

  const killTween = useCallback(() => {
    tweenRef.current?.kill()
    tweenRef.current = null
    expectedY.current = -1
    window.clearTimeout(timerRef.current)
  }, [])

  const tweenTo = useCallback(
    (target: number, duration: number) => {
      killTween()
      if (REDUCED_MOTION) {
        window.scrollTo(0, target)
        return
      }
      const proxy = { y: window.scrollY }
      expectedY.current = window.scrollY
      tweenRef.current = gsap.to(proxy, {
        y: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          expectedY.current = proxy.y
          window.scrollTo(0, proxy.y)
        },
        onComplete: () => {
          tweenRef.current = null
          expectedY.current = -1
        },
      })
    },
    [killTween],
  )

  useEffect(() => {
    const read = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll()))
      progressRef.current = p
      if (!tweenRef.current) setActiveStation(Math.round(p * SEGMENTS) - 1)
    }

    const snap = () => {
      const target =
        (Math.round(progressRef.current * SEGMENTS) / SEGMENTS) * maxScroll()
      if (Math.abs(target - window.scrollY) < 2) return
      tweenTo(target, 0.55)
    }

    const armSnap = () => {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(snap, 160)
    }

    const onScroll = () => {
      if (tweenRef.current) {
        if (Math.abs(window.scrollY - expectedY.current) <= 2) {
          read()
          return
        }
        killTween()
      }
      read()
      armSnap()
    }

    const onKeydown = () => {
      killTween()
      armSnap()
    }

    const onResize = () => {
      killTween()
      window.scrollTo(0, progressRef.current * maxScroll())
      read()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', killTween, { passive: true })
    window.addEventListener('touchstart', killTween, { passive: true })
    window.addEventListener('touchend', armSnap, { passive: true })
    window.addEventListener('keydown', onKeydown, { passive: true })
    window.addEventListener('resize', onResize)
    read()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', killTween)
      window.removeEventListener('touchstart', killTween)
      window.removeEventListener('touchend', armSnap)
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
      killTween()
    }
  }, [killTween, tweenTo])

  const scrollToStation = useCallback(
    (index: number) => {
      setActiveStation(index)
      tweenTo(stopFraction(index + 1) * maxScroll(), 0.8)
    },
    [tweenTo],
  )

  return { progressRef, activeStation, scrollToStation }
}

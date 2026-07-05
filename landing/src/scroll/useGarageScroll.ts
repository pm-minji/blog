import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { STOP_COUNT, stopFraction } from '../content/stations'

const SEGMENTS = STOP_COUNT - 1

const maxScroll = () =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

/**
 * Maps document scroll to rail progress [0..1] with a plain passive scroll
 * listener (no scroll-library magic — guaranteed behavior on iOS Safari).
 *
 * - `progressRef` updates on every scroll tick without re-rendering React;
 *   the camera rig reads it inside useFrame.
 * - `activeStation` is -1 while outside the door, otherwise the index into
 *   STATIONS nearest to the current stop. State only changes on index change.
 * - Snap and dot navigation both animate scroll through the same gsap tween
 *   slot (tweenRef), so they can never fight each other; any real user input
 *   (wheel/touch/key) kills whatever tween is running.
 */
export function useGarageScroll() {
  const progressRef = useRef(0)
  const [activeStation, setActiveStation] = useState(-1)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const timerRef = useRef(0)

  const killTween = useCallback(() => {
    tweenRef.current?.kill()
    tweenRef.current = null
    window.clearTimeout(timerRef.current)
  }, [])

  const tweenTo = useCallback(
    (target: number, duration: number) => {
      killTween()
      const proxy = { y: window.scrollY }
      tweenRef.current = gsap.to(proxy, {
        y: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => window.scrollTo(0, proxy.y),
        onComplete: () => {
          tweenRef.current = null
        },
      })
    },
    [killTween],
  )

  useEffect(() => {
    const read = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll()))
      progressRef.current = p
      setActiveStation(Math.round(p * SEGMENTS) - 1)
    }

    const snap = () => {
      const target =
        (Math.round(progressRef.current * SEGMENTS) / SEGMENTS) * maxScroll()
      if (Math.abs(target - window.scrollY) < 2) return
      tweenTo(target, 0.55)
    }

    const onScroll = () => {
      read()
      if (tweenRef.current) return
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(snap, 160)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', killTween, { passive: true })
    window.addEventListener('touchstart', killTween, { passive: true })
    window.addEventListener('keydown', killTween, { passive: true })
    read()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', killTween)
      window.removeEventListener('touchstart', killTween)
      window.removeEventListener('keydown', killTween)
      killTween()
    }
  }, [killTween, tweenTo])

  const scrollToStation = useCallback(
    (index: number) => {
      tweenTo(stopFraction(index + 1) * maxScroll(), 0.8)
    },
    [tweenTo],
  )

  return { progressRef, activeStation, scrollToStation }
}

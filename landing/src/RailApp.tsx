import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { GarageScene, PAPER_MODE } from './scene/GarageScene'
import { Overlay } from './ui/Overlay'
import { useGarageScroll } from './scroll/useGarageScroll'
import { STOP_COUNT } from './content/stations'

/** 130vh of scroll travel per rail segment, plus the viewport itself. */
const SPACER_HEIGHT = `${(STOP_COUNT - 1) * 130 + 100}vh`

/** Kinetic Hangul chapter title — Paper Garage direction sample. */
function PaperTitle() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pchar',
        { yPercent: 120, autoAlpha: 0, rotate: 4 },
        { yPercent: 0, autoAlpha: 1, rotate: 0, duration: 0.7, ease: 'power3.out', stagger: 0.055, delay: 0.3 },
      )
      gsap.fromTo(
        '.paper-sub',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.1 },
      )
    }, ref)
    return () => ctx.revert()
  }, [])
  const chars = [...'새벽 2시,']
  return (
    <div className="paper-title" ref={ref} aria-hidden="true">
      <div className="paper-line">
        {chars.map((c, i) => (
          <span key={i} className="pchar-clip">
            <span className="pchar">{c === ' ' ? ' ' : c}</span>
          </span>
        ))}
      </div>
      <p className="paper-sub">무언가가 만들어지는 중입니다</p>
    </div>
  )
}

export default function RailApp() {
  const { progressRef, activeStation, scrollToStation } = useGarageScroll()

  return (
    <>
      <div className="scroll-spacer" style={{ height: SPACER_HEIGHT }} aria-hidden="true" />
      <div className="scene">
        <GarageScene progressRef={progressRef} />
      </div>
      {PAPER_MODE ? <PaperTitle /> : null}
      <Overlay activeStation={activeStation} onDotClick={scrollToStation} />
    </>
  )
}

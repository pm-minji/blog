import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { STATIONS } from '../content/stations'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pad = (n: number) => String(n).padStart(2, '0')

interface OverlayProps {
  activeStation: number
  onDotClick: (index: number) => void
}

export function Overlay({ activeStation, onDotClick }: OverlayProps) {
  const cardsRef = useRef<HTMLDivElement>(null)

  // Keyboard focus must never be stranded inside a hidden card.
  useEffect(() => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el.closest('.card') && !el.closest('.card.is-active')) {
      el.blur()
    }
  }, [activeStation])

  // Entrance choreography for the newly active card's inner elements.
  useEffect(() => {
    if (REDUCED_MOTION || activeStation < 0 || !cardsRef.current) return
    const card = cardsRef.current.querySelector('.card.is-active')
    if (!card) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.card-step-inner', { yPercent: 110 }, { yPercent: 0, duration: 0.4 })
        .fromTo(
          '.card-title-inner',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.45 },
          '-=0.22',
        )
        .fromTo('.card-blurb', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, '-=0.25')
        .fromTo('.card-cta', { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, '-=0.18')
    }, card)
    return () => ctx.revert()
  }, [activeStation])

  return (
    <div className="overlay">
      <header className="brand">
        <h1 className="brand-name">
          PM-Minji's Garage
          <span className="brand-sub">since 2024 — 새벽 2:47</span>
        </h1>
        <a className="brand-link" href="/blog/">
          Blog
        </a>
      </header>

      <div
        className={`scroll-hint ${activeStation === -1 ? 'is-visible' : ''}`}
        aria-hidden={activeStation !== -1}
      >
        <span className="shutter" aria-hidden="true">
          <span className="slat" />
          <span className="slat" />
          <span className="slat" />
        </span>
        <span>스크롤하면 셔터가 열립니다</span>
      </div>

      <nav className="rail" aria-label="정거장 이동">
        <span className="rail-track" aria-hidden="true" />
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            className={`tick ${activeStation === i ? 'is-active' : ''}`}
            aria-label={`${s.title}(으)로 이동`}
            aria-current={activeStation === i}
            onClick={() => onDotClick(i)}
          >
            <span className="tick-bar" aria-hidden="true" />
            <span className="tick-num" aria-hidden="true">
              {pad(i + 1)}
            </span>
          </button>
        ))}
      </nav>

      <div className="cards" ref={cardsRef}>
        {STATIONS.map((s, i) => (
          <article
            key={s.id}
            className={`card ${activeStation === i ? 'is-active' : ''}`}
            aria-hidden={activeStation !== i}
          >
            <p className="card-step">
              <span className="card-step-clip">
                <span className="card-step-inner">
                  {pad(i + 1)}
                  <span className="card-step-total"> / {pad(STATIONS.length)}</span>
                </span>
              </span>
            </p>
            <h2 className="card-title">
              <span className="card-title-inner">{s.title}</span>
            </h2>
            <p className="card-blurb">{s.blurb}</p>
            {s.href && s.cta ? (
              <a className="card-cta" href={s.href} tabIndex={activeStation === i ? 0 : -1}>
                {s.cta}
                <span className="cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { STATIONS } from '../content/stations'

interface OverlayProps {
  activeStation: number
  onDotClick: (index: number) => void
}

export function Overlay({ activeStation, onDotClick }: OverlayProps) {
  useEffect(() => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el.closest('.card') && !el.closest('.card.is-active')) {
      el.blur()
    }
  }, [activeStation])

  return (
    <div className="overlay">
      <header className="brand">
        <h1 className="brand-name">PM-Minji's Garage</h1>
        <a className="brand-link" href="/blog/">
          Blog
        </a>
      </header>

      <div className={`scroll-hint ${activeStation === -1 ? 'is-visible' : ''}`} aria-hidden={activeStation !== -1}>
        <span>스크롤해서 입장</span>
        <span className="chevron" />
      </div>

      <nav className="dots" aria-label="정거장 이동">
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${activeStation === i ? 'is-active' : ''}`}
            aria-label={`${s.title}(으)로 이동`}
            aria-current={activeStation === i}
            onClick={() => onDotClick(i)}
          />
        ))}
      </nav>

      <div className="cards">
        {STATIONS.map((s, i) => (
          <article
            key={s.id}
            className={`card ${activeStation === i ? 'is-active' : ''}`}
            aria-hidden={activeStation !== i}
          >
            <p className="card-step">
              {i + 1} / {STATIONS.length}
            </p>
            <h2 className="card-title">{s.title}</h2>
            <p className="card-blurb">{s.blurb}</p>
            {s.href && s.cta ? (
              <a className="card-cta" href={s.href} tabIndex={activeStation === i ? 0 : -1}>
                {s.cta}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}

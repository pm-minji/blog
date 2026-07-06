import { useEffect, useState } from 'react'
import { Room } from './Room'
import { GameDialog } from './dialogs'
import { CLUE_IDS, useGameState } from './state'
import { useLang } from './strings'
import { isMuted, toggleMute } from './sfx'

export function GarageGame() {
  const game = useGameState()
  const { lang, toggle, t } = useLang()
  const [muted, setMuted] = useState(isMuted)
  const total = CLUE_IDS.length
  const found = game.clues.size

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (found === total && game.dialog === null && game.phase === 'lit') {
      const timer = window.setTimeout(() => game.finish(), 600)
      return () => window.clearTimeout(timer)
    }
  }, [found, total, game])

  // Entering the dark garage drifts the view toward the lamp so the one
  // glowing thing on screen is discoverable without knowing to swipe.
  useEffect(() => {
    if (game.phase !== 'dark') return
    const pan = document.querySelector('.room-pan')
    if (pan && pan.scrollWidth > pan.clientWidth) {
      pan.scrollTo({ left: (pan.scrollWidth - pan.clientWidth) * 0.42, behavior: 'smooth' })
    }
  }, [game.phase])

  return (
    <div className={`game game--${game.phase}`}>
      <div className="room-pan">
        <Room game={game} t={t} lang={lang} />
      </div>
      <div className="game-vignette" aria-hidden="true" />
      <div className="game-grain" aria-hidden="true" />

      <header className="ghud">
        <h1 className="ghud-brand">
          PM-Minji's Garage
          <span>{t.brandSub}</span>
        </h1>
        <div className="ghud-right">
          <div className="ghud-btns">
            <button className="ghud-lang" onClick={toggle} aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 보기'}>
              {lang === 'ko' ? 'EN' : '한국어'}
            </button>
            <button
              className="ghud-lang"
              onClick={() => setMuted(toggleMute())}
              aria-label={muted ? 'unmute' : 'mute'}
              aria-pressed={muted}
            >
              {muted ? '♪̸' : '♪'}
            </button>
          </div>
          {game.phase === 'lit' || game.phase === 'done' ? (
            <div className="ghud-clues" aria-label={`${t.clue} ${found} / ${total}`}>
              <span className="ghud-count">
                {t.clue} {found}
                <em> / {total}</em>
              </span>
              <span className="ghud-dots">
                {CLUE_IDS.map((id) => (
                  <i key={id} className={game.clues.has(id) ? 'on' : ''} />
                ))}
              </span>
            </div>
          ) : null}
        </div>
      </header>

      {game.phase === 'dark' ? <p className="game-toast">{t.toastDark}</p> : null}
      {game.phase === 'lit' && found === 0 ? <p className="game-toast">{t.toastLit(total)}</p> : null}

      {game.phase === 'intro' ? (
        <div className="gintro">
          <p className="gintro-time">{t.introTime}</p>
          <h2 className="gintro-title">
            {t.introTitle.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h2>
          <p className="gintro-sub">{t.introSub}</p>
          <button className="gintro-btn" onClick={game.enter}>
            {t.introBtn}
          </button>
          <p className="gintro-alt">
            <a href="/blog/">{t.introAlt}</a>
          </p>
        </div>
      ) : null}

      {game.phase === 'done' ? (
        <div className="gintro gend">
          <p className="gintro-time">
            {t.clue} {total} / {total}
          </p>
          <h2 className="gintro-title">{t.endTitle}</h2>
          <p className="gintro-sub">{t.endSub}</p>
          <div className="gend-ctas">
            <a className="gintro-btn" href="/blog/">
              {t.endBlog}
            </a>
            <a className="gend-sub" href="/about/">
              {t.endAbout}
            </a>
          </div>
        </div>
      ) : null}

      <GameDialog game={game} t={t} lang={lang} />
    </div>
  )
}

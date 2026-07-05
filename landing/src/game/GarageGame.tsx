import { useEffect } from 'react'
import { Room } from './Room'
import { GameDialog } from './dialogs'
import { CLUE_IDS, useGameState } from './state'

export function GarageGame() {
  const game = useGameState()
  const total = CLUE_IDS.length
  const found = game.clues.size

  useEffect(() => {
    if (found === total && game.dialog === null && game.phase === 'lit') {
      const t = window.setTimeout(() => game.finish(), 600)
      return () => window.clearTimeout(t)
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
        <Room game={game} />
      </div>
      <div className="game-vignette" aria-hidden="true" />
      <div className="game-grain" aria-hidden="true" />

      <header className="ghud">
        <h1 className="ghud-brand">
          PM-Minji's Garage
          <span>새벽 2:47의 차고</span>
        </h1>
        {game.phase === 'lit' || game.phase === 'done' ? (
          <div className="ghud-clues" aria-label={`단서 ${found} / ${total}`}>
            <span className="ghud-count">
              단서 {found}<em> / {total}</em>
            </span>
            <span className="ghud-dots">
              {CLUE_IDS.map((id) => (
                <i key={id} className={game.clues.has(id) ? 'on' : ''} />
              ))}
            </span>
          </div>
        ) : null}
      </header>

      {game.phase === 'dark' ? (
        <p className="game-toast">깜깜하다. 어딘가 불을 켤 만한 게 있을 텐데… (노란 줄을 찾아보세요)</p>
      ) : null}
      {game.phase === 'lit' && found === 0 ? (
        <p className="game-toast">불이 켜졌다. 차고를 뒤져 단서 {total}개를 찾아보자.</p>
      ) : null}

      {game.phase === 'intro' ? (
        <div className="gintro">
          <p className="gintro-time">AM 2:47</p>
          <h2 className="gintro-title">
            민지의 차고 앞.
            <br />
            셔터 틈으로 불빛이 샌다.
          </h2>
          <p className="gintro-sub">주인은 잠깐 자리를 비운 것 같다. 안을 둘러볼 절호의 기회.</p>
          <button className="gintro-btn" onClick={game.enter}>
            몰래 들어가기
          </button>
          <p className="gintro-alt">
            <a href="/blog/">그냥 블로그로 갈래요 →</a>
          </p>
        </div>
      ) : null}

      {game.phase === 'done' ? (
        <div className="gintro gend">
          <p className="gintro-time">단서 {total} / {total}</p>
          <h2 className="gintro-title">이 차고의 주인을 알 것 같다.</h2>
          <p className="gintro-sub">
            새벽 2시 47분에도 뭔가를 만들고, 어설퍼도 일단 출시하고, 죽은 프로젝트도 부검해서 벽에 붙여두는 사람.
          </p>
          <div className="gend-ctas">
            <a className="gintro-btn" href="/blog/">
              작업 일지 읽으러 가기
            </a>
            <a className="gend-sub" href="/about/">
              민지에 대해 →
            </a>
          </div>
        </div>
      ) : null}

      <GameDialog game={game} />
    </div>
  )
}

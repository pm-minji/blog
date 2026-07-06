import { useRef, useState } from 'react'
import type { GameState } from './state'
import type { GameStrings, Lang } from './strings'
import { PROJECTS } from './projects'
import { sfx } from './sfx'

function Card({
  index,
  title,
  onClose,
  closeLabel,
  children,
}: {
  index?: string
  title: string
  onClose: () => void
  closeLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="gdialog" role="dialog" aria-modal="true" aria-label={title}>
      <div className="gdialog-scrim" onClick={onClose} />
      <div className="gcard">
        {index ? <p className="gcard-step">{index}</p> : null}
        <h2 className="gcard-title">{title}</h2>
        <div className="gcard-body">{children}</div>
        <button className="gcard-close" onClick={onClose} aria-label={closeLabel}>
          ✕
        </button>
      </div>
    </div>
  )
}

interface DialogProps {
  game: GameState
  t: GameStrings
  lang: Lang
}

function TerminalDialog({ game, t, lang }: DialogProps) {
  const [lines, setLines] = useState<Array<{ t: string; c?: string }>>(
    t.term.boot.map((b) => ({ t: b, c: 'dim' })),
  )
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const run = (cmd: string) => {
    const out: Array<{ t: string; c?: string }> = [{ t: `$ ${cmd}`, c: 'cmd' }]
    const c = cmd.trim().toLowerCase()
    if (c === 'help') {
      out.push(...t.term.help.map((h) => ({ t: h })))
    } else if (c === 'ls projects' || c === 'ls') {
      PROJECTS.forEach((p, i) => {
        out.push({
          t: `${String(i + 1).padStart(2, '0')}_${p.name[lang]}/   (${p.status[lang]})`,
          c: p.secret ? 'accent' : undefined,
        })
      })
      game.collect('terminal')
    } else if (c === 'whoami') {
      out.push({ t: t.term.whoami })
    } else if (c === 'open blog') {
      out.push({ t: t.term.blog })
      window.setTimeout(() => (window.location.href = '/blog/'), 500)
    } else if (c === '0247') {
      out.push({ t: t.term.pw, c: 'accent' })
    } else if (c === 'make dopamine') {
      sfx.dopamine()
      out.push(
        { t: 'compiling joy...', c: 'dim' },
        { t: '▓▓▓▓▓▓▓▓▓▓ 100%', c: 'accent' },
        { t: lang === 'ko' ? '도파민 충전 완료. 오늘도 뭔가 만들어봅시다.' : 'Dopamine restored. Go build something.', c: 'accent' },
      )
    } else {
      out.push({ t: t.term.notFound(cmd), c: 'dim' })
    }
    setLines((prev) => [...prev.slice(-16), ...out])
    window.setTimeout(() => bodyRef.current?.scrollTo({ top: 99999 }), 30)
  }

  return (
    <Card index="CLUE 02" title={t.term.title} onClose={game.closeDialog} closeLabel={t.close}>
      <div className="gterm" ref={bodyRef}>
        {lines.map((l, i) => (
          <p key={i} className={`gterm-line ${l.c ?? ''}`}>
            {l.t}
          </p>
        ))}
      </div>
      <div className="gterm-cmds">
        {['help', 'ls projects', 'whoami', 'open blog'].map((c) => (
          <button key={c} onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
      <form
        className="gterm-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) run(input)
          setInput('')
        }}
      >
        <span>$</span>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.term.placeholder} aria-label={t.term.placeholder} />
      </form>
      {game.clues.has('terminal') ? <p className="gclue-badge">{t.clueBadge}</p> : null}
    </Card>
  )
}

function LockDialog({ game, t, lang }: DialogProps) {
  const [digits, setDigits] = useState([0, 0, 0, 0])
  const [shake, setShake] = useState(false)
  const secret = PROJECTS.find((p) => p.secret)
  const bump = (i: number, d: number) =>
    setDigits((prev) => prev.map((v, k) => (k === i ? (v + d + 10) % 10 : v)))
  const check = () => {
    if (digits.join('') === '0247') {
      game.solveLock()
      game.collect('toolbox')
    } else {
      sfx.lockWrong()
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
    }
  }

  if (game.lockSolved) {
    return (
      <Card index="CLUE 03" title={t.lockOpen.title} onClose={game.closeDialog} closeLabel={t.close}>
        <p className="gcard-text">{t.lockOpen.text}</p>
        {secret ? (
          <p className="gcard-quote">
            "{secret.blurb[lang]}" {t.lockOpen.quoteSuffix}
          </p>
        ) : null}
        <p className="gclue-badge">{t.clueBadge}</p>
      </Card>
    )
  }
  return (
    <Card title={t.lockClosed.title} onClose={game.closeDialog} closeLabel={t.close}>
      <p className="gcard-text">{t.lockClosed.text}</p>
      <div className={`glock ${shake ? 'glock--shake' : ''}`}>
        {digits.map((d, i) => (
          <div key={i} className="glock-dial">
            <button onClick={() => bump(i, 1)} aria-label={`digit ${i + 1} up`}>
              ▲
            </button>
            <span>{d}</span>
            <button onClick={() => bump(i, -1)} aria-label={`digit ${i + 1} down`}>
              ▼
            </button>
          </div>
        ))}
      </div>
      <button className="glock-submit" onClick={check}>
        {t.lockClosed.open}
      </button>
      <p className="gcard-hint">{t.lockClosed.hint}</p>
    </Card>
  )
}

export function GameDialog({ game, t, lang }: DialogProps) {
  const close = game.closeDialog
  const d = game.dialog
  if (d && d.startsWith('project:')) {
    const p = PROJECTS.find((x) => x.id === d.slice(8))
    if (!p) return null
    return (
      <Card index={p.name[lang]} title={p.name[lang]} onClose={close} closeLabel={t.close}>
        <p className="gcard-text">{p.blurb[lang]}</p>
        <p className="gcard-hint">
          {t.project.status}: {p.status[lang]}
        </p>
        {p.href ? (
          <p className="gcard-text">
            <a href={p.href}>{t.project.visit}</a>
          </p>
        ) : null}
      </Card>
    )
  }
  switch (d) {
    case 'whiteboard':
      return (
        <Card index="CLUE 01" title={t.wb.title} onClose={close} closeLabel={t.close}>
          <p className="gcard-text">{t.wb.text}</p>
          <p className="gcard-quote">{t.wb.quote}</p>
          <p className="gclue-badge">{t.clueBadge}</p>
        </Card>
      )
    case 'terminal':
      return <TerminalDialog game={game} t={t} lang={lang} />
    case 'toolbox':
      return <LockDialog game={game} t={t} lang={lang} />
    case 'corkboard':
      return (
        <Card index="CLUE 04" title={t.cork.title} onClose={close} closeLabel={t.close}>
          <p className="gcard-text">{t.cork.text}</p>
          <p className="gcard-text">
            <a href="/about/">{t.cork.link}</a>
          </p>
          <p className="gclue-badge">{t.clueBadge}</p>
        </Card>
      )
    case 'mailbox':
      return (
        <Card index="CLUE 05" title={t.mail.title} onClose={close} closeLabel={t.close}>
          <p className="gcard-text">{t.mail.text}</p>
          <p className="gcard-text">
            <a href="/blog/">{t.mail.link}</a>
          </p>
          <p className="gclue-badge">{t.clueBadge}</p>
        </Card>
      )
    case 'clock':
      return (
        <Card title={t.clock.title} onClose={close} closeLabel={t.close}>
          <p className="gcard-text">{t.clock.text}</p>
          <p className="gcard-hint">{t.clock.hint}</p>
        </Card>
      )
    case 'radio':
      return (
        <Card title={t.radio.title} onClose={close} closeLabel={t.close}>
          <p className="gcard-text">{t.radio.text}</p>
        </Card>
      )
    default:
      return null
  }
}

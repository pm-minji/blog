import { useRef, useState } from 'react'
import type { GameState } from './state'

function Card({
  index,
  title,
  onClose,
  children,
}: {
  index?: string
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="gdialog" role="dialog" aria-modal="true" aria-label={title}>
      <div className="gdialog-scrim" onClick={onClose} />
      <div className="gcard">
        {index ? <p className="gcard-step">{index}</p> : null}
        <h2 className="gcard-title">{title}</h2>
        <div className="gcard-body">{children}</div>
        <button className="gcard-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  )
}

const CLUE_BADGE = <p className="gclue-badge">단서 확보</p>

function TerminalDialog({ game }: { game: GameState }) {
  const [lines, setLines] = useState<Array<{ t: string; c?: string }>>([
    { t: 'PM-MINJI OS v1.0 — guest 세션', c: 'dim' },
    { t: '"help"를 입력해 보세요.', c: 'dim' },
  ])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const run = (cmd: string) => {
    const out: Array<{ t: string; c?: string }> = [{ t: `$ ${cmd}`, c: 'cmd' }]
    const c = cmd.trim().toLowerCase()
    if (c === 'help') {
      out.push({ t: 'ls projects — 진행 중인 프로젝트' }, { t: 'whoami — 이 차고의 주인' }, { t: 'open blog — 작업 일지로 이동' })
    } else if (c === 'ls projects' || c === 'ls') {
      out.push(
        { t: '01_사이드프로젝트A/   (정비 중)' },
        { t: '02_사이드프로젝트B/   (지표 관찰)' },
        { t: '03_비밀_프로토타입/   (공구함?)', c: 'accent' },
      )
      game.collect('terminal')
    } else if (c === 'whoami') {
      out.push({ t: 'pm-minji — 만드는 걸 좋아하는 PM' })
    } else if (c === 'open blog') {
      out.push({ t: '블로그로 이동합니다...' })
      window.setTimeout(() => (window.location.href = '/blog/'), 500)
    } else if (c === '0247') {
      out.push({ t: '...비밀번호는 여기가 아니라 공구함에.', c: 'accent' })
    } else {
      out.push({ t: `command not found: ${cmd}`, c: 'dim' })
    }
    setLines((prev) => [...prev.slice(-16), ...out])
    window.setTimeout(() => bodyRef.current?.scrollTo({ top: 99999 }), 30)
  }

  return (
    <Card index="CLUE 02" title="민지의 컴퓨터" onClose={game.closeDialog}>
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
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="명령어 입력" aria-label="터미널 명령어" />
      </form>
      {game.clues.has('terminal') ? CLUE_BADGE : null}
    </Card>
  )
}

function LockDialog({ game }: { game: GameState }) {
  const [digits, setDigits] = useState([0, 0, 0, 0])
  const [shake, setShake] = useState(false)
  const bump = (i: number, d: number) =>
    setDigits((prev) => prev.map((v, k) => (k === i ? (v + d + 10) % 10 : v)))
  const check = () => {
    if (digits.join('') === '0247') {
      game.solveLock()
      game.collect('toolbox')
    } else {
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
    }
  }

  if (game.lockSolved) {
    return (
      <Card index="CLUE 03" title="공구함이 열렸다" onClose={game.closeDialog}>
        <p className="gcard-text">
          안에는 반쯤 조립된 <strong>비밀 프로토타입</strong>과 손글씨 메모가 들어 있다.
        </p>
        <p className="gcard-quote">"아직 아무한테도 안 보여준 것. 다음 달엔 리프트에 올린다." — MJ</p>
        {CLUE_BADGE}
      </Card>
    )
  }
  return (
    <Card title="잠긴 공구함" onClose={game.closeDialog}>
      <p className="gcard-text">4자리 자물쇠가 걸려 있다. 이 차고 어딘가에 힌트가 있을 텐데.</p>
      <div className={`glock ${shake ? 'glock--shake' : ''}`}>
        {digits.map((d, i) => (
          <div key={i} className="glock-dial">
            <button onClick={() => bump(i, 1)} aria-label={`자리 ${i + 1} 올리기`}>
              ▲
            </button>
            <span>{d}</span>
            <button onClick={() => bump(i, -1)} aria-label={`자리 ${i + 1} 내리기`}>
              ▼
            </button>
          </div>
        ))}
      </div>
      <button className="glock-submit" onClick={check}>
        열기
      </button>
      <p className="gcard-hint">힌트: 민지의 차고에서 시간은 늘 같은 곳에 멈춰 있다.</p>
    </Card>
  )
}

export function GameDialog({ game }: { game: GameState }) {
  const close = game.closeDialog
  switch (game.dialog) {
    case 'whiteboard':
      return (
        <Card index="CLUE 01" title="화이트보드의 로드맵" onClose={close}>
          <p className="gcard-text">
            아이디어 → 프로토타입 → <strong>출시</strong>에 빨간 동그라미. 그리고 옆에 화살표로 다시 처음으로.
          </p>
          <p className="gcard-quote">"완벽한 계획보다 어설픈 출시. 이 차고의 유일한 규칙." </p>
          {CLUE_BADGE}
        </Card>
      )
    case 'terminal':
      return <TerminalDialog game={game} />
    case 'toolbox':
      return <LockDialog game={game} />
    case 'corkboard':
      return (
        <Card index="CLUE 04" title="코르크보드의 기록들" onClose={close}>
          <p className="gcard-text">
            폴라로이드 몇 장 — 새벽 3시의 책상, 첫 배포의 날, 오른쪽 위로 꺾이는 그래프. 그리고 "일단 만들자" 메모.
          </p>
          <p className="gcard-text">
            이 차고의 주인이 궁금하다면 <a href="/about/">민지에 대해 →</a>
          </p>
          {CLUE_BADGE}
        </Card>
      )
    case 'mailbox':
      return (
        <Card index="CLUE 05" title="우편함" onClose={close}>
          <p className="gcard-text">차고 소식지가 꽂혀 있다 — 새 프로젝트가 리프트에 오를 때마다 발행된다고.</p>
          <p className="gcard-text">
            <a href="/blog/">작업 일지 구독하러 가기 →</a>
          </p>
          {CLUE_BADGE}
        </Card>
      )
    case 'clock':
      return (
        <Card title="벽시계" onClose={close}>
          <p className="gcard-text">
            새벽 <strong>2시 47분</strong>에 멈춰 있다. 건전지가 없는 게 아니라, 일부러 맞춰둔 것 같다.
          </p>
          <p className="gcard-hint">어딘가의 비밀번호 같기도 하고.</p>
        </Card>
      )
    case 'radio':
      return (
        <Card title="라디오" onClose={close}>
          <p className="gcard-text">지지직 — 새벽 주파수에서 lofi가 흘러나온다. 작업이 잘 되는 소리.</p>
        </Card>
      )
    default:
      return null
  }
}

import type { GameState } from './state'

/**
 * The garage interior as one wide inline-SVG scene (viewBox 1600x1000).
 * Every prop is a hotspot group; the game layer drives phase classes.
 * Mobile pans horizontally via native scroll on the wrapper.
 */
export function Room({ game }: { game: GameState }) {
  const { phase, clues, lockSolved } = game
  const dark = phase === 'dark'
  const hs = (id: Parameters<GameState['openDialog']>[0], label: string) => ({
    className: `hs hs-${id} ${clues.has(id as never) ? 'hs--found' : ''}`,
    role: 'button' as const,
    tabIndex: phase === 'lit' || phase === 'done' ? 0 : -1,
    'aria-label': label,
    onClick: () => (phase === 'lit' || phase === 'done') && game.openDialog(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && (phase === 'lit' || phase === 'done')) {
        e.preventDefault()
        game.openDialog(id)
      }
    },
  })

  return (
    <svg
      viewBox="0 0 1600 1000"
      className={`room ${dark ? 'room--dark' : ''} ${phase === 'lit' || phase === 'done' ? 'room--lit' : ''}`}
      aria-label="민지의 차고 내부"
    >
      <defs>
        <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1119" />
          <stop offset="0.65" stopColor="#181c2a" />
          <stop offset="0.82" stopColor="#1e2335" />
          <stop offset="1" stopColor="#131522" />
        </linearGradient>
        <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#211b16" />
          <stop offset="1" stopColor="#0d0b0e" />
        </linearGradient>
        <linearGradient id="rDesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6543" />
          <stop offset="0.15" stopColor="#6e4f33" />
          <stop offset="1" stopColor="#463122" />
        </linearGradient>
        <linearGradient id="rCrt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4dbc8" />
          <stop offset="0.6" stopColor="#c9bfa9" />
          <stop offset="1" stopColor="#a2977f" />
        </linearGradient>
        <radialGradient id="rLampGlow">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffbe78" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffbe78" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf92" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffcf92" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rMoonGlow">
          <stop offset="0" stopColor="#dfe4f2" stopOpacity="0.4" />
          <stop offset="1" stopColor="#dfe4f2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rShutter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3040" />
          <stop offset="1" stopColor="#1d2030" />
        </linearGradient>
      </defs>

      <g className="room-art">
        <rect width="1600" height="1000" fill="url(#rWall)" />
        <g stroke="#222739" strokeWidth="3" opacity="0.7">
          <line x1="440" y1="0" x2="440" y2="770" />
          <line x1="1240" y1="0" x2="1240" y2="770" />
        </g>
        <rect y="770" width="1600" height="230" fill="url(#rFloor)" />
        <rect y="764" width="1600" height="9" fill="#0a0b10" />

        {/* ---------------- shutter door + mailbox (left) */}
        <g>
          <rect x="70" y="120" width="330" height="650" fill="url(#rShutter)" rx="6" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x="82" y={140 + i * 62} width="306" height="44" rx="6" fill="#262b3d" stroke="#1a1d2b" strokeWidth="3" />
          ))}
          <rect x="180" y="700" width="110" height="26" rx="6" fill="#3a4056" />
          <rect x="60" y="96" width="350" height="30" rx="6" fill="#ff5a1f" opacity="0.9" />
          <text x="235" y="117" textAnchor="middle" fontFamily="Menlo, monospace" fontSize="17" fontWeight="700" fill="#2b1408" letterSpacing="3">
            EXIT — BLOG
          </text>
        </g>
        <g {...hs('mailbox', '우편함 살펴보기')}>
          <rect x="428" y="470" width="86" height="120" rx="10" fill="#b3502a" />
          <rect x="428" y="470" width="86" height="34" rx="10" fill="#d86a3a" />
          <rect x="446" y="496" width="50" height="8" rx="4" fill="#3a1c10" />
          <circle cx="471" cy="548" r="7" fill="#3a1c10" />
          <circle className="hs-ring" cx="471" cy="530" r="58" />
        </g>

        {/* ---------------- whiteboard + clock (center-left) */}
        <g {...hs('whiteboard', '화이트보드 읽기')}>
          <rect x="500" y="200" width="300" height="212" rx="12" fill="#3d434f" />
          <rect x="510" y="210" width="280" height="192" rx="8" fill="#f2f0e9" />
          <g strokeLinecap="round" fill="none">
            <rect x="528" y="238" width="66" height="30" rx="6" stroke="#2b3a67" strokeWidth="4" />
            <path d="M 598 253 h 28 m -8 -7 l 9 7 l -9 7" stroke="#2b3a67" strokeWidth="4" />
            <rect x="632" y="238" width="82" height="30" rx="6" stroke="#2b3a67" strokeWidth="4" />
            <ellipse cx="748" cy="253" rx="34" ry="21" stroke="#d9372e" strokeWidth="3.5" />
          </g>
          <text x="536" y="259" fontFamily="Apple SD Gothic Neo, sans-serif" fontSize="15" fontWeight="700" fill="#2b3a67">아이디어</text>
          <text x="640" y="259" fontFamily="Apple SD Gothic Neo, sans-serif" fontSize="15" fontWeight="700" fill="#2b3a67">프로토타입</text>
          <text x="731" y="259" fontFamily="Apple SD Gothic Neo, sans-serif" fontSize="15" fontWeight="700" fill="#2b3a67">출시</text>
          <g transform="translate(534 296)">
            <rect width="52" height="52" fill="#ffd54a" transform="rotate(-4)" />
            <rect x="62" width="52" height="52" fill="#ff9a5c" transform="rotate(3 88 26)" />
            <rect x="124" width="52" height="52" fill="#9fe1cb" transform="rotate(-2 150 26)" />
          </g>
          <path d="M 540 382 q 20 -8 40 0 t 40 0" stroke="#3f8f4f" strokeWidth="3.5" fill="none" />
          <text x="700" y="388" fontFamily="Menlo, monospace" fontSize="13" fill="#8b8b90">v0.3</text>
          <circle className="hs-ring" cx="650" cy="306" r="130" />
        </g>
        <g {...hs('clock', '벽시계 보기')}>
          <rect x="860" y="130" width="128" height="64" rx="10" fill="#131118" stroke="#2a2634" strokeWidth="3" />
          <text x="924" y="176" textAnchor="middle" fontFamily="Menlo, monospace" fontSize="40" fontWeight="700" fill="#ffb14e" className="clock-digits">
            2:47
          </text>
          <circle className="hs-ring" cx="924" cy="162" r="60" />
        </g>

        {/* ---------------- desk + CRT + lamp (center) */}
        <path className="lamp-cone" d="M 856 484 L 918 470 L 1210 768 L 930 768 Z" fill="url(#rCone)" />
        <g>
          <rect x="620" y="640" width="560" height="26" rx="7" fill="url(#rDesk)" />
          <rect x="620" y="640" width="560" height="6" rx="3" fill="#a87c50" opacity="0.85" />
          <rect x="656" y="666" width="16" height="112" rx="5" fill="#2b2530" />
          <rect x="1128" y="666" width="16" height="112" rx="5" fill="#2b2530" />
        </g>
        <g {...hs('terminal', '컴퓨터 사용하기')}>
          <rect x="800" y="430" width="230" height="188" rx="20" fill="url(#rCrt)" />
          <rect x="822" y="450" width="186" height="136" rx="9" fill="#0a0d0a" />
          <g className="crt-screen">
            <rect x="828" y="456" width="174" height="124" rx="6" fill="#12200f" />
            <text x="840" y="480" fontFamily="Menlo, monospace" fontSize="13" fill="#7fdf9a">$ whoami</text>
            <text x="840" y="500" fontFamily="Menlo, monospace" fontSize="13" fill="#7fdf9a">pm-minji</text>
            <text x="840" y="524" fontFamily="Menlo, monospace" fontSize="13" fill="#7fdf9a">$ <tspan className="crt-cursor" fill="#ffcf92">█</tspan></text>
          </g>
          <rect x="884" y="618" width="62" height="16" rx="4" fill="#b0a68e" />
          <circle cx="1012" cy="602" r="4" fill="#d84a3a" />
          <g transform="translate(1022 452) rotate(4)">
            <rect width="48" height="48" fill="#ffd54a" />
            <text x="7" y="20" fontFamily="Apple SD Gothic Neo, sans-serif" fontWeight="700" fontSize="12" fill="#43350f">출시</text>
            <text x="7" y="36" fontFamily="Apple SD Gothic Neo, sans-serif" fontWeight="700" fontSize="12" fill="#43350f">금요일</text>
          </g>
          <circle className="hs-ring" cx="915" cy="524" r="120" />
        </g>
        <g className="lamp" onClick={() => dark && game.lightsOn()} role={dark ? 'button' : undefined} tabIndex={dark ? 0 : -1} aria-label="램프 줄 당기기"
          onKeyDown={(e) => { if (dark && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); game.lightsOn() } }}>
          <path d="M 700 636 L 760 540 L 826 486" stroke="#23252f" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="760" cy="540" r="8" fill="#191b22" />
          <g transform="translate(826 486) rotate(142)">
            <path d="M -12 -16 L 58 -16 L 42 20 L 4 20 Z" fill="#23252f" />
            <ellipse cx="24" cy="20" rx="19" ry="7" fill="#ffe4b0" className="lamp-bulb" />
          </g>
          <circle className="lamp-glow" cx="842" cy="500" r="52" fill="url(#rLampGlow)" />
          <path className="lamp-cord" d="M 706 632 q -26 40 -18 96" stroke="#d8cfc0" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle className="lamp-cord-tip" cx="688" cy="728" r="9" fill="#ffd54a" stroke="#8a6c2c" strokeWidth="2" />
          <circle className="lamp-hit" cx="688" cy="722" r="52" fill="transparent" />
          <rect x="676" y="630" width="52" height="11" rx="5" fill="#191b22" />
        </g>
        <g>
          <rect x="1064" y="592" width="13" height="48" rx="4" fill="#8a3b2a" />
          <rect x="1082" y="578" width="13" height="62" rx="4" fill="#2f4a44" />
          <rect x="1100" y="602" width="13" height="38" rx="4" fill="#3a3550" />
          <rect x="742" y="606" width="38" height="36" rx="7" fill="#ff5a1f" />
          <path d="M 780 614 a 10 10 0 0 1 0 20" stroke="#ff5a1f" strokeWidth="6" fill="none" />
          <path d="M 752 596 q 4 -10 -2 -18 M 766 598 q 6 -12 -2 -22" stroke="#cfc8bb" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" className="mug-steam" />
        </g>

        {/* ---------------- workbench + toolbox + corkboard + radio (right) */}
        <g {...hs('corkboard', '코르크보드 살펴보기')}>
          <rect x="1290" y="180" width="250" height="190" rx="10" fill="#52402e" />
          <rect x="1300" y="190" width="230" height="170" rx="6" fill="#8a6f52" />
          <g transform="translate(1318 210) rotate(-4)">
            <rect width="62" height="74" fill="#f4efe6" />
            <rect x="6" y="6" width="50" height="48" fill="#141019" />
            <circle cx="24" cy="26" r="12" fill="#ffb37a" opacity="0.8" />
          </g>
          <g transform="translate(1398 216) rotate(3)">
            <rect width="62" height="74" fill="#f4efe6" />
            <rect x="6" y="6" width="50" height="48" fill="#1a2030" />
            <path d="M 12 40 l 12 -14 l 10 8 l 14 -18" stroke="#5fd0a5" strokeWidth="3.5" fill="none" />
          </g>
          <g transform="translate(1472 224) rotate(-2)">
            <rect width="52" height="52" fill="#ffd54a" />
            <text x="6" y="22" fontFamily="Apple SD Gothic Neo, sans-serif" fontWeight="700" fontSize="12" fill="#43350f">일단</text>
            <text x="6" y="40" fontFamily="Apple SD Gothic Neo, sans-serif" fontWeight="700" fontSize="12" fill="#43350f">만들자</text>
          </g>
          <circle cx="1349" cy="212" r="5" fill="#d9372e" />
          <circle cx="1429" cy="218" r="5" fill="#2b6cb0" />
          <circle className="hs-ring" cx="1415" cy="275" r="120" />
        </g>
        <g>
          <rect x="1270" y="640" width="290" height="24" rx="6" fill="#4c392b" />
          <rect x="1286" y="664" width="14" height="114" rx="5" fill="#2b2530" />
          <rect x="1530" y="664" width="14" height="114" rx="5" fill="#2b2530" />
        </g>
        <g {...hs('toolbox', lockSolved ? '공구함 (열림)' : '잠긴 공구함')}>
          <rect x="1310" y="560" width="180" height="80" rx="10" fill="#b3502a" />
          <rect x="1310" y="560" width="180" height="22" rx="10" fill="#d86a3a" />
          <rect x="1382" y="548" width="36" height="16" rx="8" fill="#8a3b1e" />
          {lockSolved ? (
            <g>
              <rect x="1382" y="588" width="36" height="30" rx="6" fill="#3f8f4f" />
              <path d="M 1392 602 l 7 8 l 14 -16" stroke="#eaf6ee" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <rect x="1382" y="590" width="36" height="28" rx="6" fill="#3a3540" />
              <path d="M 1390 590 v -8 a 10 10 0 0 1 20 0 v 8" stroke="#3a3540" strokeWidth="6" fill="none" />
              <circle cx="1400" cy="604" r="4" fill="#c9c0b2" />
            </g>
          )}
          <circle className="hs-ring" cx="1400" cy="596" r="90" />
        </g>
        <g {...hs('radio', '라디오 틀기')}>
          <rect x="1500" y="596" width="56" height="44" rx="8" fill="#3a3f52" />
          <circle cx="1516" cy="618" r="9" fill="#c9c0b2" />
          <rect x="1532" y="608" width="18" height="4" rx="2" fill="#c9c0b2" />
          <rect x="1532" y="618" width="18" height="4" rx="2" fill="#c9c0b2" />
          <path d="M 1552 596 l 12 -18" stroke="#c9c0b2" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* ---------------- floor dressing */}
        <ellipse cx="900" cy="856" rx="180" ry="22" fill="#54301f" />
        <ellipse cx="900" cy="852" rx="180" ry="22" fill="#6a3d26" opacity="0.4" />
        <g transform="translate(560 812)">
          <rect width="26" height="40" rx="4" fill="#3a4a6e" transform="rotate(-8)" />
          <rect x="24" y="4" width="26" height="38" rx="4" fill="#7e4238" transform="rotate(4 37 23)" />
        </g>
        <rect x="1180" y="820" width="60" height="42" rx="5" fill="#8a6f52" transform="rotate(-6 1210 841)" />
      </g>

      {/* ---- always-lit layer: window + moon (outside dark filter) */}
      <g>
        <rect x="1060" y="180" width="150" height="200" rx="8" fill="#0a0c14" stroke="#2a3049" strokeWidth="7" />
        <line x1="1135" y1="180" x2="1135" y2="380" stroke="#2a3049" strokeWidth="7" />
        <line x1="1060" y1="280" x2="1210" y2="280" stroke="#2a3049" strokeWidth="7" />
        <circle cx="1172" cy="232" r="24" fill="#e8e6da" />
        <circle cx="1164" cy="226" r="5" fill="#c9c6b8" opacity="0.8" />
        <circle cx="1172" cy="232" r="70" fill="url(#rMoonGlow)" />
        <circle cx="1090" cy="220" r="1.8" fill="#e8ecf8" opacity="0.7" />
        <circle cx="1108" cy="330" r="1.5" fill="#e8ecf8" opacity="0.5" />
      </g>
    </svg>
  )
}

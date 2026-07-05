#!/usr/bin/env node
/**
 * Deterministic texture generator for the 심야 작업실 scene.
 *
 * Every texture with Korean text is rendered from SVG (resvg + macOS system
 * fonts) instead of generative AI — text can never come out garbled, output
 * is reproducible, and the flat-graphic look matches the low-poly scene.
 * Organic textures (floor, corkboard base) are procedural (feTurbulence);
 * they can be upgraded to generated images later without touching the scene.
 *
 * Run: node scripts/make-textures.mjs   (from landing/)
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/tex')
fs.mkdirSync(OUT, { recursive: true })

const FONTS = ['/System/Library/Fonts/AppleSDGothicNeo.ttc', '/System/Library/Fonts/Menlo.ttc']
const GOTHIC = 'Apple SD Gothic Neo'
const MONO = 'Menlo'

const ACCENT = '#ff5a1f'

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

async function render(name, w, h, body, { quality = 80 } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: w },
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: GOTHIC },
  })
  const png = resvg.render().asPng()
  await sharp(png).webp({ quality }).toFile(path.join(OUT, `${name}.webp`))
  console.log(`ok ${name}.webp (${w}x${h})`)
}

const noise = (id, freq, octaves = 2) =>
  `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.6 0"/></filter>`

const T = (x, y, size, fill, text, { font = GOTHIC, weight = 700, anchor = 'start', spacing = 0, rotate = 0, opacity = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ''}>${text}</text>`

// ---------------------------------------------------------------- whiteboard
async function whiteboard() {
  const rnd = mulberry32(7)
  const sticky = (x, y, c, rot, lines) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="4" y="5" width="128" height="128" fill="#00000022"/>
      <rect width="128" height="128" fill="${c}"/>
      <rect width="128" height="16" fill="#00000010"/>
      ${lines.map((l, i) => T(12, 44 + i * 24, 17, '#43350f', l)).join('')}
    </g>`
  const flowBox = (x, y, w, label, rot) =>
    `<g transform="rotate(${rot} ${x + w / 2} ${y + 30})">
      <rect x="${x}" y="${y}" width="${w}" height="64" rx="8" fill="none" stroke="#2b3a67" stroke-width="5" stroke-linejoin="round"/>
      ${T(x + w / 2, y + 42, 26, '#2b3a67', label, { anchor: 'middle' })}
    </g>`
  const arrow = (d, tip) =>
    `<path d="${d}" fill="none" stroke="#2b3a67" stroke-width="5" stroke-linecap="round"/>
     <path d="${tip}" fill="none" stroke="#2b3a67" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`

  const scribbles = Array.from({ length: 3 }, (_, i) => {
    const x = 90 + rnd() * 100
    const y = 640 + i * 26
    return `<path d="M ${x} ${y} q 18 -9 36 0 t 36 0 t 30 -3" fill="none" stroke="#3f8f4f" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`
  }).join('')

  await render('whiteboard', 1024, 768, `
    <rect width="1024" height="768" fill="#f6f5f0"/>
    <rect width="1024" height="768" filter="url(#wbn)" opacity="0.05"/>
    ${noise('wbn', 0.9, 1)}
    ${T(28, 44, 19, '#8b8b90', 'PM-MINJI&apos;S GARAGE — ROADMAP v0.3', { font: MONO, weight: 400, spacing: 1 })}
    ${T(996, 44, 19, '#8b8b90', '2026.07', { font: MONO, weight: 400, anchor: 'end' })}
    <line x1="28" y1="60" x2="996" y2="60" stroke="#d8d6ce" stroke-width="2"/>

    ${flowBox(88, 200, 190, '아이디어', -1.2)}
    ${arrow('M 288 232 C 320 224, 340 240, 368 232', 'M 352 222 L 370 232 L 352 243')}
    ${flowBox(380, 196, 240, '프로토타입', 0.8)}
    ${arrow('M 630 228 C 662 220, 682 238, 710 230', 'M 694 220 L 712 230 L 694 241')}
    ${flowBox(724, 200, 170, '출시!', -0.6)}
    <ellipse cx="809" cy="232" rx="118" ry="52" fill="none" stroke="#d9372e" stroke-width="4.5" opacity="0.85" transform="rotate(-3 809 232)"/>
    <ellipse cx="812" cy="235" rx="124" ry="47" fill="none" stroke="#d9372e" stroke-width="3.5" opacity="0.6" transform="rotate(2 812 235)"/>

    <path d="M 200 268 C 190 320, 210 350, 250 372" fill="none" stroke="#2b3a67" stroke-width="4" stroke-dasharray="1 12" stroke-linecap="round"/>
    ${T(150, 420, 21, '#2b3a67', '반복!', { rotate: -4 })}

    ${sticky(96, 470, '#ffd54a', -4, ['유저 인터뷰', '5명 잡기'])}
    ${sticky(260, 486, '#ff9a5c', 3, ['MVP는', '금요일까지'])}
    ${sticky(424, 468, '#ffe9a8', -2, ['지표부터', '정하기'])}
    ${sticky(720, 460, '#9fe1cb', 5, ['일단', '배포하자'])}
    <path d="M 738 585 l 12 14 l 26 -30" fill="none" stroke="#1d7a4f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="rotate(5 750 580)"/>

    <g opacity="0.9">
      <circle cx="940" cy="120" r="26" fill="none" stroke="#e5a02c" stroke-width="4"/>
      <path d="M 930 152 h 20 M 932 160 h 16" stroke="#e5a02c" stroke-width="4" stroke-linecap="round"/>
      <path d="M 940 84 v -12 M 908 100 l -9 -9 M 972 100 l 9 -9" stroke="#e5a02c" stroke-width="4" stroke-linecap="round"/>
    </g>
    ${scribbles}
    ${T(96, 630, 20, '#4a4a52', '다음 차례:')}
    ${T(200, 630, 20, '#2b3a67', '_______ (아직 비밀)')}

    <g opacity="0.22">
      <circle cx="900" cy="660" r="42" fill="none" stroke="#8a5a33" stroke-width="9"/>
      <circle cx="900" cy="660" r="34" fill="none" stroke="#8a5a33" stroke-width="3"/>
    </g>
    <rect x="600" y="640" width="130" height="34" fill="#e8e6de" transform="rotate(-2 665 657)"/>
  `)
}

// ---------------------------------------------------------------- screens
const screenChrome = (title, bodyFill = '#17171c') => `
  <rect width="768" height="480" fill="${bodyFill}"/>
  <rect width="768" height="34" fill="#101013"/>
  <circle cx="22" cy="17" r="6" fill="#ff5f57"/><circle cx="42" cy="17" r="6" fill="#febc2e"/><circle cx="62" cy="17" r="6" fill="#28c840"/>
  ${T(384, 22, 13, '#7a7a85', title, { font: MONO, weight: 400, anchor: 'middle' })}`

async function screenDeskA() {
  const rnd = mulberry32(11)
  const tokenColors = ['#ff8a50', '#e3b341', '#8ab4f8', '#c792ea', '#9aa0a6']
  let lines = ''
  for (let i = 0; i < 13; i++) {
    const y = 76 + i * 22
    lines += T(178, y + 11, 12, '#4a4a55', String(i + 4), { font: MONO, weight: 400, anchor: 'end' })
    if (i === 2 || i === 8) {
      lines += T(196 + (i === 8 ? 24 : 0), y + 11, 13, '#5f6b5f', i === 2 ? '// 자기 전에 배포하기' : '// 도파민 충전 완료', { font: MONO, weight: 400 })
      continue
    }
    let x = 196 + (i % 4 === 1 ? 24 : i % 4 === 2 ? 48 : 0)
    const n = 2 + Math.floor(rnd() * 4)
    for (let k = 0; k < n; k++) {
      const w = 26 + rnd() * 78
      lines += `<rect x="${x}" y="${y}" width="${w}" height="11" rx="3" fill="${tokenColors[Math.floor(rnd() * tokenColors.length)]}" opacity="0.85"/>`
      x += w + 12
    }
  }
  await render('screen-desk-a', 768, 480, `
    ${screenChrome('deploy.ts — garage-landing')}
    <rect y="34" width="160" height="446" fill="#121216"/>
    ${['src', 'scene', 'deploy.ts', 'stations.ts', 'merge.mjs'].map((f, i) => T(20, 72 + i * 26, 12, i === 2 ? '#ff8a50' : '#8a8a95', f, { font: MONO, weight: 400 })).join('')}
    <rect x="160" y="34" width="140" height="30" fill="#17171c"/>
    ${T(178, 54, 12, '#e8e8ee', 'deploy.ts', { font: MONO, weight: 400 })}
    ${lines}
    <rect y="364" width="768" height="96" fill="#0d0d10"/>
    ${T(20, 392, 13, '#9aa0a6', '$ npm run deploy', { font: MONO, weight: 400 })}
    ${T(20, 414, 13, '#5fb26a', '[merge-dist] ok: merged 3 landing files into dist', { font: MONO, weight: 400 })}
    ${T(20, 436, 13, '#5fb26a', 'built in 167ms — 02:47:12 AM', { font: MONO, weight: 400 })}
    <rect y="460" width="768" height="20" fill="#1b1b22"/>
    ${T(14, 474, 11, '#ff8a50', 'main*', { font: MONO, weight: 400 })}
    ${T(754, 474, 11, '#7a7a85', 'UTF-8  TS  02:47', { font: MONO, weight: 400, anchor: 'end' })}
  `)
}

async function screenDeskB() {
  const pts = [42, 55, 48, 66, 60, 74, 70, 86, 80, 95]
  const W = 640, H = 150, x0 = 84, y0 = 330
  const px = (i) => x0 + (i * W) / (pts.length - 1)
  const py = (v) => y0 - (v / 100) * H
  const line = pts.map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ')
  const area = `${line} L ${px(pts.length - 1)} ${y0} L ${x0} ${y0} Z`
  const kpi = (x, label, value, accent = '#8ab4f8') => `
    <rect x="${x}" y="64" width="200" height="86" rx="10" fill="#1a1f2e"/>
    ${T(x + 18, 94, 13, '#7d8598', label, { weight: 400 })}
    ${T(x + 18, 132, 26, accent, value, { font: MONO })}`
  await render('screen-desk-b', 768, 480, `
    ${screenChrome('garage-analytics — weekly', '#141824')}
    ${T(36, 58, 15, '#aab4cc', '주간 리포트', { weight: 700 })}
    ${kpi(36, 'DAU', '128')}
    ${kpi(252, '리텐션 D7', '41%', '#5fd0a5')}
    ${kpi(468, '신규 가입', '+23')}
    <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b8def" stop-opacity="0.45"/><stop offset="1" stop-color="#5b8def" stop-opacity="0"/></linearGradient>
    ${[0, 25, 50, 75, 100].map((v) => `<line x1="${x0}" y1="${py(v)}" x2="${x0 + W}" y2="${py(v)}" stroke="#232a3d" stroke-width="1"/>`).join('')}
    <path d="${area}" fill="url(#ar)"/>
    <path d="${line}" fill="none" stroke="#8ab4f8" stroke-width="3" stroke-linejoin="round"/>
    ${pts.map((v, i) => `<circle cx="${px(i)}" cy="${py(v)}" r="3.5" fill="#cfe0ff"/>`).join('')}
    ${T(x0, 370, 11, '#5c6478', 'W1', { font: MONO, weight: 400 })}
    ${T(x0 + W, 370, 11, '#5c6478', 'W10', { font: MONO, weight: 400, anchor: 'end' })}
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${86 + i * 26}" y="${446 - (12 + ((i * 37) % 34))}" width="16" height="${12 + ((i * 37) % 34)}" rx="3" fill="#31405f"/>`).join('')}
    ${T(300, 440, 12, '#5c6478', '시간대별 방문 — 새벽 2시에 피크?!', { weight: 400 })}
  `)
}

async function screenDeskC() {
  const phone = (x, y, blocks) => `
    <rect x="${x}" y="${y}" width="126" height="252" rx="16" fill="#101014" stroke="#3a3a46" stroke-width="2"/>
    ${blocks.map(([bx, by, bw, bh, c]) => `<rect x="${x + bx}" y="${y + by}" width="${bw}" height="${bh}" rx="4" fill="${c}"/>`).join('')}`
  await render('screen-desk-c', 768, 480, `
    ${screenChrome('figma — onboarding_v2', '#1a1a20')}
    <rect y="34" width="150" height="446" fill="#141418"/>
    ${['Pages', 'onboarding_v2', 'home_feed', 'paywall_test', 'components'].map((f, i) => T(18, 70 + i * 26, 12, i === 1 ? '#ff8a50' : '#8a8a95', f, { font: MONO, weight: 400 })).join('')}
    <rect x="618" y="34" width="150" height="446" fill="#141418"/>
    ${T(636, 68, 12, '#8a8a95', 'Design', { font: MONO, weight: 400 })}
    ${[0, 1, 2, 3].map((i) => `<rect x="636" y="${84 + i * 34}" width="114" height="20" rx="4" fill="#1f1f26"/>`).join('')}
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#2c2c34"/></pattern>
    <rect x="150" y="34" width="468" height="446" fill="url(#dots)"/>
    ${phone(210, 90, [[14, 18, 98, 44, '#23232b'], [14, 74, 98, 12, '#2e2e38'], [14, 94, 70, 12, '#2e2e38'], [14, 130, 98, 60, '#20242e'], [14, 210, 98, 24, '#3a3f52']])}
    ${phone(420, 118, [[14, 20, 60, 14, '#2e2e38'], [14, 48, 98, 90, '#20242e'], [14, 152, 98, 24, ACCENT], [30, 190, 66, 10, '#2e2e38']])}
    <rect x="408" y="106" width="150" height="276" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 4"/>
    ${[[408, 106], [558, 106], [408, 382], [558, 382]].map(([hx, hy]) => `<rect x="${hx - 4}" y="${hy - 4}" width="8" height="8" fill="#fff" stroke="${ACCENT}" stroke-width="2"/>`).join('')}
    <rect x="408" y="86" width="112" height="18" fill="${ACCENT}"/>
    ${T(414, 99, 11, '#fff', 'onboarding_v2', { font: MONO, weight: 400 })}
  `)
}

async function screenMinji() {
  const paragraphs = [
    '오늘도 결국 새벽이다. 셔터를 내리려다가 문득,',
    '이 차고에 처음 불을 켰던 날이 생각났다.',
    '',
    '만드는 일은 대부분 계획대로 되지 않는다.',
    '그래도 리프트 위에 뭔가 올라가 있는 동안은',
    '내일이 조금 기다려진다.',
    '',
    '오늘의 작업 로그:',
  ]
  await render('screen-minji', 768, 480, `
    ${screenChrome('새 글 작성 — PM-Minji&apos;s Garage', '#15151a')}
    ${T(130, 108, 30, '#ececf1', '새벽의 배포 일지')}
    ${T(130, 136, 13, '#6f6f7a', '초안 — 마지막 저장 02:46', { weight: 400 })}
    <line x1="130" y1="154" x2="638" y2="154" stroke="#26262e" stroke-width="1"/>
    ${paragraphs.map((p, i) => (p ? T(130, 192 + i * 30, 15, '#9ca3af', p, { weight: 400 }) : '')).join('')}
    <rect x="130" y="415" width="180" height="10" rx="3" fill="#2c2c35"/>
    <rect y="446" width="768" height="34" fill="#101014"/>
    <path d="M 24 456 l 12 7 l -12 7 Z" fill="#ff8a50"/>
    ${T(48, 468, 12, '#8a8a95', 'lofi — ship mode', { font: MONO, weight: 400 })}
    <rect x="200" y="461" width="420" height="4" rx="2" fill="#26262e"/>
    <rect x="200" y="461" width="168" height="4" rx="2" fill="#ff8a50"/>
    ${T(744, 468, 11, '#6f6f7a', '02:47', { font: MONO, weight: 400, anchor: 'end' })}
  `)
}

// ---------------------------------------------------------------- small signs
async function clock247() {
  await render('clock-247', 256, 128, `
    <rect width="256" height="128" fill="#0c0b0e"/>
    <filter id="gl"><feGaussianBlur stdDeviation="3"/></filter>
    <g font-family="${MONO}" font-weight="700" font-size="86" fill="#ffb14e">
      <text x="24" y="94" filter="url(#gl)" opacity="0.55">2</text><text x="24" y="94">2</text>
      <text x="104" y="94" filter="url(#gl)" opacity="0.55">47</text><text x="104" y="94">47</text>
    </g>
    <circle cx="90" cy="52" r="5" fill="#3a2c1a"/><circle cx="90" cy="82" r="5" fill="#3a2c1a"/>
    ${T(128, 118, 12, '#4d4436', 'AM', { font: MONO, weight: 400, anchor: 'middle', spacing: 4 })}
  `)
}

async function nameplate() {
  await render('nameplate', 256, 64, `
    <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4beb2"/><stop offset="0.45" stop-color="#98928a"/>
      <stop offset="0.55" stop-color="#8a847b"/><stop offset="1" stop-color="#aca69a"/>
    </linearGradient>
    <rect width="256" height="64" rx="6" fill="url(#mt)"/>
    <rect x="3" y="3" width="250" height="58" rx="4" fill="none" stroke="#6e685f" stroke-width="1.5"/>
    ${T(129, 39, 26, '#e8e2d6', 'PM 민지', { anchor: 'middle', spacing: 2, opacity: 0.55 })}
    ${T(128, 38, 26, '#3b372f', 'PM 민지', { anchor: 'middle', spacing: 2 })}
    ${T(128, 54, 8, '#5c564c', 'PRODUCT MANAGER · MAKER', { font: MONO, weight: 400, anchor: 'middle', spacing: 2 })}
  `)
}

async function doorSign() {
  await render('door-sign', 768, 256, `
    <rect width="768" height="256" rx="10" fill="#242019"/>
    <rect x="10" y="10" width="748" height="236" rx="6" fill="none" stroke="#3f382c" stroke-width="3"/>
    <rect width="768" height="256" filter="url(#dsn)" opacity="0.07"/>
    ${noise('dsn', 0.35, 2)}
    ${[[26, 26], [742, 26], [26, 230], [742, 230]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#171410"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="2.5" fill="#57503f"/>`).join('')}
    ${T(384, 118, 64, ACCENT, "PM-MINJI'S GARAGE", { anchor: 'middle', spacing: 3 })}
    <line x1="200" y1="152" x2="568" y2="152" stroke="#57503f" stroke-width="2"/>
    ${T(384, 200, 27, '#cbb89a', '민지의 차고 · SINCE 2024', { anchor: 'middle', spacing: 4, weight: 400 })}
  `)
}

// ---------------------------------------------------------------- posters
async function posterShip() {
  await render('poster-ship', 512, 768, `
    <rect width="512" height="768" fill="#161114"/>
    <g font-family="${GOTHIC}" font-weight="800" font-size="150">
      <text x="52" y="270" fill="#7a2c10" transform="rotate(-2 52 270) translate(5 4)">일단</text>
      <text x="52" y="270" fill="${ACCENT}" transform="rotate(-2 52 270)">일단</text>
      <text x="52" y="450" fill="#7a2c10" transform="rotate(-2 52 450) translate(5 4)">만들자</text>
      <text x="52" y="450" fill="${ACCENT}" transform="rotate(-2 52 450)">만들자</text>
    </g>
    <path d="M 60 540 h 250" stroke="${ACCENT}" stroke-width="8" stroke-linecap="round" transform="rotate(-2 60 540)"/>
    ${T(58, 620, 19, '#d9c9b0', '생각은 나중에, 후회는 회고 때', { weight: 400, rotate: -2 })}
    <line x1="40" y1="690" x2="472" y2="690" stroke="#3a3038" stroke-width="2"/>
    ${T(40, 722, 14, '#8a7a6a', "PM-MINJI'S GARAGE — RISO NO.1 — 2026", { font: MONO, weight: 400, spacing: 1 })}
    <rect width="512" height="768" filter="url(#psn)" opacity="0.08"/>
    ${noise('psn', 0.7, 2)}
  `)
}

async function posterGrid() {
  let grid = ''
  for (let x = 0; x <= 512; x += 32) grid += `<line x1="${x}" y1="0" x2="${x}" y2="768" stroke="${x % 128 ? '#1c2436' : '#28324a'}" stroke-width="1"/>`
  for (let y = 0; y <= 768; y += 32) grid += `<line x1="0" y1="${y}" x2="512" y2="${y}" stroke="${y % 128 ? '#1c2436' : '#28324a'}" stroke-width="1"/>`
  const iso = (x, y, w, d, h) => {
    const p = (px, py) => `${x + (px - py) * 0.86} ${y + (px + py) * 0.5 - h}`
    return `<path d="M ${p(0, 0)} L ${p(w, 0)} L ${p(w, d)} L ${p(0, d)} Z M ${p(0, 0)} l 0 ${h} M ${p(w, 0)} l 0 ${h} M ${p(w, d)} l 0 ${h} M ${p(0, d)} l 0 ${h} M ${x + (0 - 0) * 0.86} ${y + 0.5 * (0 + 0)} " fill="none" stroke="#7ea6ff" stroke-width="1.6" opacity="0.9"/>
    <path d="M ${p(0, 0)} L ${p(w, 0)} L ${p(w, d)} L ${p(0, d)} Z" transform="translate(0 ${h})" fill="none" stroke="#7ea6ff" stroke-width="1.6" opacity="0.5"/>`
  }
  await render('poster-grid', 512, 768, `
    <rect width="512" height="768" fill="#0f1420"/>
    ${grid}
    ${T(48, 74, 24, '#9fc0ff', 'GARAGE LAYOUT', { font: MONO, spacing: 3 })}
    ${T(48, 100, 13, '#5b729e', 'ISOMETRIC PROJECTION — DO NOT SCALE', { font: MONO, weight: 400, spacing: 1 })}
    ${iso(250, 300, 150, 90, 60)}
    ${iso(150, 420, 60, 36, 26)}
    ${iso(300, 470, 60, 36, 26)}
    ${iso(210, 540, 60, 36, 26)}
    ${T(360, 260, 12, '#7ea6ff', 'MAIN HALL', { font: MONO, weight: 400 })}
    ${T(96, 420, 12, '#7ea6ff', 'BAY-01', { font: MONO, weight: 400 })}
    ${T(408, 480, 12, '#7ea6ff', 'BAY-02', { font: MONO, weight: 400 })}
    ${T(140, 580, 12, '#7ea6ff', 'BAY-03', { font: MONO, weight: 400 })}
    <line x1="252" y1="288" x2="356" y2="256" stroke="#3a4a6e" stroke-width="1"/>
    <rect x="300" y="640" width="172" height="88" fill="#0f1420" stroke="#28324a" stroke-width="1.5"/>
    ${T(312, 664, 11, '#7ea6ff', 'REV: 0.3', { font: MONO, weight: 400 })}
    ${T(312, 684, 11, '#7ea6ff', 'SCALE: 1:50', { font: MONO, weight: 400 })}
    ${T(312, 704, 11, '#7ea6ff', 'DRAWN: MJ  02:47', { font: MONO, weight: 400 })}
  `)
}

// ---------------------------------------------------------------- corkboard
async function corkboard() {
  const polaroid = (x, y, rot, photo, caption) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="5" y="6" width="150" height="182" fill="#00000030"/>
      <rect width="150" height="182" fill="#f4efe6"/>
      <g>${photo}</g>
      ${T(75, 172, 14, '#5a5348', caption, { anchor: 'middle' })}
    </g>`
  const photoDesk = `<rect x="11" y="11" width="128" height="128" fill="#141019"/><radialGradient id="pg1"><stop offset="0" stop-color="#ffb37a"/><stop offset="1" stop-color="#ffb37a" stop-opacity="0"/></radialGradient><circle cx="55" cy="60" r="40" fill="url(#pg1)"/><rect x="30" y="90" width="90" height="30" fill="#2a2430"/><rect x="60" y="60" width="34" height="26" fill="#3a3444"/>`
  const photoLaunch = `<rect x="11" y="11" width="128" height="128" fill="#1a2030"/><rect x="30" y="80" width="90" height="40" fill="#2c3550"/><path d="M 75 40 l 12 24 h -24 Z" fill="${ACCENT}"/><rect x="72" y="64" width="6" height="18" fill="#e8b64c"/><circle cx="75" cy="36" r="4" fill="#ffd54a"/>`
  const photoUsers = `<rect x="11" y="11" width="128" height="128" fill="#10141c"/><path d="M 20 110 L 45 80 L 70 95 L 100 55 L 130 70" fill="none" stroke="#5fd0a5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="55" r="6" fill="#9fe1cb"/>`
  const memo = (x, y, c, rot, lines) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="3" y="4" width="150" height="96" fill="#00000028"/>
      <rect width="150" height="96" fill="${c}"/>
      ${lines.map((l, i) => T(14, 36 + i * 26, 16, '#4a3a12', l)).join('')}
    </g>`
  const pin = (x, y, c) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}"/><circle cx="${x - 2.5}" cy="${y - 2.5}" r="2.6" fill="#ffffff88"/>`
  await render('corkboard', 1024, 768, `
    <rect width="1024" height="768" fill="#8a6f52"/>
    <rect width="1024" height="768" filter="url(#ckn)" opacity="0.35" style="mix-blend-mode:multiply"/>
    ${noise('ckn', 0.06, 4)}
    <rect x="0" y="0" width="1024" height="768" fill="none" stroke="#52402e" stroke-width="36"/>
    <rect x="18" y="18" width="988" height="732" fill="none" stroke="#3d2f21" stroke-width="4"/>

    ${polaroid(80, 90, -4, photoDesk, '새벽 3시의 책상')}
    ${polaroid(280, 130, 3, photoLaunch, '첫 배포의 날')}
    ${polaroid(700, 100, 5, photoUsers, '유저 10명!')}
    ${memo(500, 110, '#ffd54a', -3, ['이번 달 목표:', '출시 1개'])}
    ${memo(120, 430, '#ffe9a8', 2, ['커피 줄이기', '(3주째 실패)'])}
    ${memo(660, 420, '#ff9a5c', -2, ['일단 만들자'])}
    <path d="M 358 128 C 480 60, 600 80, 706 112" fill="none" stroke="#c73b2d" stroke-width="2.5" opacity="0.9"/>
    ${pin(155, 96, '#d9372e')}${pin(358, 128, '#2b6cb0')}${pin(775, 108, '#d9a72e')}
    ${pin(575, 116, '#d9372e')}${pin(196, 438, '#2b6cb0')}${pin(736, 426, '#3f8f4f')}
    ${T(500, 660, 22, '#3d2f21', '"만드는 사람은 멈추지 않는다"', { anchor: 'middle', opacity: 0.75 })}
    ${T(500, 692, 14, '#52402e', '— 어느 새벽의 민지', { anchor: 'middle', weight: 400, opacity: 0.75 })}
  `)
}

// ---------------------------------------------------------------- floor
async function floorConcrete() {
  const rnd = mulberry32(23)
  const stains = Array.from({ length: 6 }, () => {
    const x = 80 + rnd() * 860, y = 80 + rnd() * 860, r = 60 + rnd() * 160
    return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * (0.5 + rnd() * 0.5)}" fill="#000" opacity="${0.03 + rnd() * 0.04}" filter="url(#fblur)" transform="rotate(${rnd() * 90} ${x} ${y})"/>`
  }).join('')
  const cracks = Array.from({ length: 4 }, () => {
    const x = rnd() * 1024, y = rnd() * 1024
    return `<path d="M ${x} ${y} l ${20 + rnd() * 60} ${10 + rnd() * 40} l ${-10 + rnd() * 50} ${20 + rnd() * 50}" fill="none" stroke="#0d0c0f" stroke-width="1.4" opacity="0.35"/>`
  }).join('')
  await render('floor-concrete', 1024, 1024, `
    <filter id="fblur"><feGaussianBlur stdDeviation="18"/></filter>
    <rect width="1024" height="1024" fill="#232126"/>
    <rect width="1024" height="1024" filter="url(#fn1)" opacity="0.10" style="mix-blend-mode:screen"/>
    ${noise('fn1', 0.008, 3)}
    <rect width="1024" height="1024" filter="url(#fn2)" opacity="0.07" style="mix-blend-mode:multiply"/>
    ${noise('fn2', 0.11, 2)}
    ${stains}
    ${cracks}
  `, { quality: 74 })
}

// ---------------------------------------------------------------- skylight
async function skylight() {
  const rnd = mulberry32(41)
  const stars = Array.from({ length: 60 }, () => {
    const x = rnd() * 512, y = rnd() * 300, r = 0.5 + rnd() * 1.2
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8ecf8" opacity="${0.25 + rnd() * 0.6}"/>`
  }).join('')
  await render('skylight', 512, 384, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070a18"/><stop offset="0.6" stop-color="#0d1430"/><stop offset="1" stop-color="#16204a"/>
    </linearGradient>
    <rect width="512" height="384" fill="url(#sky)"/>
    ${stars}
    <radialGradient id="mg"><stop offset="0" stop-color="#f2f0e4" stop-opacity="0.9"/><stop offset="0.3" stop-color="#dfe2ec" stop-opacity="0.25"/><stop offset="1" stop-color="#dfe2ec" stop-opacity="0"/></radialGradient>
    <circle cx="370" cy="110" r="120" fill="url(#mg)"/>
    <circle cx="370" cy="110" r="34" fill="#f4f1e2"/>
    <circle cx="358" cy="100" r="7" fill="#dcd8c6" opacity="0.7"/>
    <circle cx="382" cy="122" r="5" fill="#dcd8c6" opacity="0.6"/>
    <ellipse cx="150" cy="300" rx="190" ry="36" fill="#1c2745" opacity="0.55"/>
    <ellipse cx="420" cy="330" rx="160" ry="28" fill="#151d38" opacity="0.6"/>
  `)
}

const jobs = { whiteboard, screenDeskA, screenDeskB, screenDeskC, screenMinji, clock247, nameplate, doorSign, posterShip, posterGrid, corkboard, floorConcrete, skylight }
for (const [name, fn] of Object.entries(jobs)) {
  try {
    await fn()
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`)
    process.exitCode = 1
  }
}

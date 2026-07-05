#!/usr/bin/env node
/**
 * Paper Garage proof-of-look — one lamplit workstation vignette drawn as
 * layered SVG scene planes (bg / hero / fg), rendered via the same
 * resvg pipeline as the texture set. Transparent-alpha webp layers.
 *
 * Run: node scripts/make-paper-scene.mjs   (from landing/)
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/paper')
fs.mkdirSync(OUT, { recursive: true })

const FONTS = ['/System/Library/Fonts/AppleSDGothicNeo.ttc', '/System/Library/Fonts/Menlo.ttc']
const GOTHIC = 'Apple SD Gothic Neo'
const MONO = 'Menlo'

async function render(name, w, h, body, { quality = 86 } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: w },
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: GOTHIC },
  })
  const png = resvg.render().asPng()
  await sharp(png).webp({ quality, alphaQuality: 90 }).toFile(path.join(OUT, `${name}.webp`))
  console.log(`ok ${name}.webp`)
}

// ------------------------------------------------------------------ BG wall
async function bg() {
  await render('paper-bg', 2048, 1152, `
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e1018"/>
      <stop offset="0.62" stop-color="#161a28"/>
      <stop offset="0.8" stop-color="#1c2133"/>
      <stop offset="1" stop-color="#12141f"/>
    </linearGradient>
    <rect width="2048" height="1152" fill="url(#wall)"/>

    <g stroke="#20263a" stroke-width="3" opacity="0.7">
      <line x1="256" y1="0" x2="256" y2="870"/>
      <line x1="768" y1="0" x2="768" y2="870"/>
      <line x1="1280" y1="0" x2="1280" y2="870"/>
      <line x1="1792" y1="0" x2="1792" y2="870"/>
    </g>

    <radialGradient id="warm" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#3a2d20" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="#241f22" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#241f22" stop-opacity="0"/>
    </radialGradient>
    <rect width="2048" height="1152" fill="url(#warm)"/>

    <g opacity="0.85">
      <rect x="330" y="240" width="360" height="14" rx="4" fill="#232839"/>
      <rect x="348" y="180" width="52" height="60" rx="3" fill="#2c3350"/>
      <rect x="410" y="168" width="40" height="72" rx="3" fill="#39304a"/>
      <rect x="458" y="190" width="46" height="50" rx="3" fill="#503a35"/>
      <rect x="516" y="176" width="34" height="64" rx="3" fill="#2c3350"/>
      <rect x="560" y="196" width="58" height="44" rx="3" fill="#3a4a44"/>
      <rect x="628" y="184" width="30" height="56" rx="3" fill="#4a3550"/>
    </g>

    <g opacity="0.9">
      <rect x="1430" y="150" width="300" height="400" rx="10" fill="#0a0c14" stroke="#2a3049" stroke-width="8"/>
      <line x1="1580" y1="150" x2="1580" y2="550" stroke="#2a3049" stroke-width="8"/>
      <line x1="1430" y1="350" x2="1730" y2="350" stroke="#2a3049" stroke-width="8"/>
      <circle cx="1660" cy="230" r="42" fill="#e8e6da"/>
      <circle cx="1646" cy="220" r="9" fill="#c9c6b8" opacity="0.8"/>
      <circle cx="1672" cy="242" r="6" fill="#c9c6b8" opacity="0.7"/>
      <radialGradient id="moonglow"><stop offset="0" stop-color="#dfe4f2" stop-opacity="0.35"/><stop offset="1" stop-color="#dfe4f2" stop-opacity="0"/></radialGradient>
      <circle cx="1660" cy="230" r="130" fill="url(#moonglow)"/>
      <g fill="#e8ecf8">
        <circle cx="1475" cy="200" r="2.4" opacity="0.8"/><circle cx="1520" cy="260" r="1.8" opacity="0.6"/>
        <circle cx="1500" cy="430" r="2" opacity="0.7"/><circle cx="1690" cy="420" r="1.6" opacity="0.5"/>
        <circle cx="1620" cy="480" r="2.2" opacity="0.6"/>
      </g>
    </g>

    <g transform="translate(900 210) rotate(-1.5)" opacity="0.92">
      <rect width="220" height="300" fill="#1b2030"/>
      <rect x="10" y="10" width="200" height="280" fill="none" stroke="#2e3650" stroke-width="2"/>
      <text x="26" y="60" font-family="${MONO}" font-size="20" fill="#5b729e">GARAGE</text>
      <text x="26" y="86" font-family="${MONO}" font-size="20" fill="#5b729e">PLAN v0.3</text>
      <path d="M 40 140 h 140 v 90 h -140 Z M 40 185 h 140 M 110 140 v 90" stroke="#41547e" stroke-width="2.5" fill="none"/>
      <circle cx="60" cy="260" r="6" fill="none" stroke="#41547e" stroke-width="2"/>
    </g>

    <linearGradient id="floorline" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1f1a16"/>
      <stop offset="1" stop-color="#0c0a0e"/>
    </linearGradient>
    <rect y="870" width="2048" height="282" fill="url(#floorline)"/>
    <rect y="864" width="2048" height="10" fill="#090a10"/>
  `)
}

// ------------------------------------------------------------- HERO station
async function hero() {
  await render('paper-hero', 1600, 1000, `
    <defs>
      <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8a6543"/><stop offset="0.15" stop-color="#6e4f33"/><stop offset="1" stop-color="#463122"/>
      </linearGradient>
      <linearGradient id="crt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e4dbc8"/><stop offset="0.6" stop-color="#c9bfa9"/><stop offset="1" stop-color="#a2977f"/>
      </linearGradient>
      <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1d2b20"/><stop offset="1" stop-color="#0d150f"/>
      </linearGradient>
      <radialGradient id="lampGlow">
        <stop offset="0" stop-color="#ffd9a0" stop-opacity="0.95"/>
        <stop offset="0.35" stop-color="#ffbe78" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#ffbe78" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffcf92" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#ffcf92" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="lampArm" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#3c3f4e"/><stop offset="1" stop-color="#23252f"/>
      </linearGradient>
    </defs>

    <path d="M 342 496 L 414 480 L 790 900 L 430 900 Z" fill="url(#cone)"/>

    <ellipse cx="800" cy="905" rx="520" ry="46" fill="#000" opacity="0.5"/>

    <g>
      <rect x="330" y="690" width="940" height="34" rx="8" fill="url(#deskTop)"/>
      <rect x="330" y="690" width="940" height="7" rx="3.5" fill="#a87c50" opacity="0.85"/>
      <g fill="#2b2530">
        <rect x="392" y="724" width="22" height="180" rx="6"/>
        <rect x="1186" y="724" width="22" height="180" rx="6"/>
        <rect x="380" y="898" width="46" height="12" rx="6"/>
        <rect x="1174" y="898" width="46" height="12" rx="6"/>
      </g>
      <rect x="392" y="724" width="6" height="180" fill="#584b62" opacity="0.6"/>
      <rect x="1186" y="724" width="6" height="180" fill="#584b62" opacity="0.6"/>
    </g>

    <g>
      <rect x="640" y="380" width="330" height="270" rx="26" fill="url(#crt)"/>
      <rect x="640" y="380" width="330" height="270" rx="26" fill="none" stroke="#7d7460" stroke-width="2" opacity="0.5"/>
      <rect x="672" y="410" width="266" height="196" rx="12" fill="#0a0d0a"/>
      <rect x="680" y="418" width="250" height="180" rx="8" fill="url(#screenGlow)"/>
      <g font-family="${MONO}" font-size="15" fill="#7fdf9a">
        <text x="696" y="448">$ whoami</text>
        <text x="696" y="472">pm-minji</text>
        <text x="696" y="500">$ ls projects/</text>
        <text x="696" y="524" fill="#e8b64c">01/  02/  03/</text>
        <text x="696" y="556">$ make dopamine</text>
        <text x="696" y="582" fill="#7fdf9a">building... <tspan fill="#ffcf92">█</tspan></text>
      </g>
      <radialGradient id="screenHalo"><stop offset="0" stop-color="#9fe6ae" stop-opacity="0.22"/><stop offset="1" stop-color="#9fe6ae" stop-opacity="0"/></radialGradient>
      <ellipse cx="805" cy="510" rx="240" ry="170" fill="url(#screenHalo)"/>
      <rect x="760" y="650" width="90" height="24" rx="4" fill="#b0a68e"/>
      <rect x="726" y="672" width="160" height="16" rx="8" fill="#8d8471"/>
      <circle cx="948" cy="632" r="5" fill="#d84a3a"/>
      <g transform="translate(958 432) rotate(4)">
        <rect width="64" height="64" fill="#ffd54a"/>
        <text x="8" y="28" font-family="${GOTHIC}" font-weight="700" font-size="15" fill="#43350f">출시</text>
        <text x="8" y="48" font-family="${GOTHIC}" font-weight="700" font-size="15" fill="#43350f">금요일</text>
      </g>
    </g>

    <g>
      <path d="M 470 688 L 430 560 L 372 470" stroke="url(#lampArm)" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="430" cy="560" r="11" fill="#191b22"/>
      <g transform="translate(372 470) rotate(-38)">
        <path d="M -14 -20 L 74 -20 L 52 26 L 8 26 Z" fill="#23252f"/>
        <path d="M -14 -20 L 74 -20 L 66 -6 L -6 -6 Z" fill="#40434f"/>
        <ellipse cx="30" cy="26" rx="24" ry="8" fill="#ffe4b0"/>
      </g>
      <circle cx="402" cy="500" r="60" fill="url(#lampGlow)"/>
      <rect x="440" y="682" width="60" height="12" rx="6" fill="#191b22"/>
      <path d="M 452 560 q -60 24 -36 122" stroke="#191b22" stroke-width="5" fill="none" opacity="0.9"/>
    </g>

    <g>
      <path d="M 348 468 q 14 -22 30 -2 q -18 4 -30 2" fill="#d8cfc0" opacity="0.9"/>
      <path d="M 360 440 q 10 -16 24 -4" stroke="#d8cfc0" stroke-width="3" fill="none" opacity="0.55"/>
      <path d="M 330 500 q -10 14 4 22" stroke="#d8cfc0" stroke-width="2.5" fill="none" opacity="0.45"/>
    </g>

    <g>
      <rect x="1030" y="620" width="16" height="70" rx="4" fill="#8a3b2a"/>
      <rect x="1052" y="600" width="16" height="90" rx="4" fill="#2f4a44"/>
      <rect x="1074" y="636" width="16" height="54" rx="4" fill="#3a3550"/>
      <rect x="1024" y="612" width="74" height="10" rx="4" fill="#463122"/>
    </g>

    <g>
      <rect x="1098" y="642" width="46" height="46" rx="9" fill="#ff5a1f"/>
      <rect x="1098" y="642" width="46" height="12" rx="6" fill="#ff8352"/>
      <path d="M 1144 654 a 13 13 0 0 1 0 24" stroke="#ff5a1f" stroke-width="8" fill="none"/>
      <path d="M 1112 630 q 5 -12 -2 -22 M 1128 632 q 7 -14 -2 -26" stroke="#cfc8bb" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
    </g>

    <g>
      <ellipse cx="580" cy="906" rx="150" ry="18" fill="#31201a" opacity="0.85"/>
      <ellipse cx="580" cy="900" rx="150" ry="18" fill="#54301f"/>
      <g transform="translate(510 838)">
        <rect width="34" height="52" rx="4" fill="#3a4a6e" transform="rotate(-8)"/>
        <rect x="30" y="6" width="34" height="48" rx="4" fill="#7e4238" transform="rotate(4 47 30)"/>
        <rect x="62" y="2" width="30" height="54" rx="4" fill="#3f5c46" transform="rotate(-3 77 29)"/>
      </g>
    </g>
  `)
}

// -------------------------------------------------------------- FG occluder
async function fg() {
  await render('paper-fg', 1600, 1000, `
    <defs>
      <linearGradient id="fgdark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#07080d"/><stop offset="1" stop-color="#05060a"/>
      </linearGradient>
    </defs>
    <g opacity="0.96">
      <path d="M -20 1000 L -20 760 Q 240 720 420 780 L 470 1000 Z" fill="url(#fgdark)"/>
      <path d="M 130 768 q 30 -120 -40 -190 q 90 40 84 186 Z" fill="#0a0f12"/>
      <path d="M 180 760 q 60 -100 150 -110 q -70 60 -110 118 Z" fill="#0c1116"/>
      <path d="M 1600 1000 L 1600 810 Q 1420 790 1310 850 L 1290 1000 Z" fill="url(#fgdark)"/>
      <rect x="1370" y="742" width="150" height="90" rx="10" fill="#0a0c12"/>
      <rect x="1390" y="722" width="46" height="22" rx="5" fill="#0e1118"/>
    </g>
  `)
}

for (const fn of [bg, hero, fg]) {
  try {
    await fn()
  } catch (e) {
    console.error(`FAIL: ${e.message}`)
    process.exitCode = 1
  }
}

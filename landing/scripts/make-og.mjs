#!/usr/bin/env node
/** OG image (1200x630) for the garage escape room. Run from landing/. */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')
fs.mkdirSync(OUT, { recursive: true })
const FONTS = ['/System/Library/Fonts/AppleSDGothicNeo.ttc', '/System/Library/Fonts/Menlo.ttc']

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0c0e16"/><stop offset="1" stop-color="#14121a"/>
  </linearGradient>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <radialGradient id="warm" cx="0.72" cy="0.55" r="0.55">
    <stop offset="0" stop-color="#4a3520" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#4a3520" stop-opacity="0"/>
  </radialGradient>
  <rect width="1200" height="630" fill="url(#warm)"/>

  <g transform="translate(760 150)">
    <rect x="-30" y="60" width="360" height="18" rx="6" fill="#5a4028"/>
    <rect x="40" y="-110" width="220" height="176" rx="20" fill="#d8cfc0"/>
    <rect x="62" y="-90" width="176" height="126" rx="9" fill="#0a0d0a"/>
    <rect x="68" y="-84" width="164" height="114" rx="6" fill="#12200f"/>
    <text x="80" y="-58" font-family="Menlo" font-size="15" fill="#7fdf9a">$ whoami</text>
    <text x="80" y="-34" font-family="Menlo" font-size="15" fill="#7fdf9a">pm-minji</text>
    <text x="80" y="-6" font-family="Menlo" font-size="15" fill="#7fdf9a">$ make dopamine</text>
    <text x="80" y="18" font-family="Menlo" font-size="15" fill="#ffcf92">building... █</text>
    <rect x="128" y="66" width="52" height="14" rx="4" fill="#b0a68e"/>
    <g transform="translate(268 -132) rotate(5)">
      <rect width="58" height="58" fill="#ffd54a"/>
      <text x="8" y="24" font-family="Apple SD Gothic Neo" font-weight="700" font-size="15" fill="#43350f">출시</text>
      <text x="8" y="44" font-family="Apple SD Gothic Neo" font-weight="700" font-size="15" fill="#43350f">금요일</text>
    </g>
    <rect x="-140" y="-104" width="126" height="62" rx="10" fill="#131118" stroke="#2a2634" stroke-width="3"/>
    <text x="-77" y="-59" text-anchor="middle" font-family="Menlo" font-weight="700" font-size="38" fill="#ffb14e">2:47</text>
  </g>

  <text x="84" y="238" font-family="Menlo" font-size="24" letter-spacing="6" fill="#ff5a1f">AM 2:47 — ESCAPE THE GARAGE</text>
  <text x="80" y="330" font-family="Apple SD Gothic Neo" font-weight="800" font-size="72" fill="#f4f2ee">민지의 차고에</text>
  <text x="80" y="416" font-family="Apple SD Gothic Neo" font-weight="800" font-size="72" fill="#f4f2ee">잠입했다.</text>
  <text x="84" y="480" font-family="Apple SD Gothic Neo" font-weight="400" font-size="26" fill="#b8b4ad">단서 5개를 찾아 이 PM의 정체를 밝혀내세요</text>
  <rect x="84" y="524" width="6" height="44" fill="#ff5a1f"/>
  <text x="106" y="556" font-family="Menlo" font-size="22" fill="#d9c9b0">pm-minji.com</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Apple SD Gothic Neo' },
})
await sharp(resvg.render().asPng()).png({ quality: 90 }).toFile(path.join(OUT, 'og.png'))
console.log('ok og.png')

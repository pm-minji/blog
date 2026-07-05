import { CanvasTexture, SRGBColorSpace } from 'three'

/** Runtime gradient textures for fake volumetrics — zero network cost. */

function radial(stops: Array<[number, string]>, size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const [o, col] of stops) g.addColorStop(o, col)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

function vertical(stops: Array<[number, string]>, w = 16, h = 128) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, h)
  for (const [o, col] of stops) g.addColorStop(o, col)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

let cache: { pool: CanvasTexture; cone: CanvasTexture; blob: CanvasTexture } | null = null

export function fxTextures() {
  cache ??= {
    pool: radial([
      [0, 'rgba(255, 214, 165, 0.85)'],
      [0.5, 'rgba(255, 190, 130, 0.28)'],
      [1, 'rgba(255, 190, 130, 0)'],
    ]),
    cone: vertical([
      [0, 'rgba(255, 220, 175, 0.55)'],
      [1, 'rgba(255, 220, 175, 0)'],
    ]),
    blob: radial([
      [0, 'rgba(0, 0, 0, 0.55)'],
      [0.7, 'rgba(0, 0, 0, 0.25)'],
      [1, 'rgba(0, 0, 0, 0)'],
    ]),
  }
  return cache
}

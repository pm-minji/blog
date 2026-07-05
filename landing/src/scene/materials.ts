import { MeshStandardMaterial, MeshBasicMaterial, Color } from 'three'

/**
 * Shared material singletons — every mesh in the scene pulls from this
 * palette so the GPU sees a handful of shader programs and uniforms
 * instead of one per mesh. Do not create materials inside components.
 */
export const ACCENT = '#ff5a1f'

export const wood = new MeshStandardMaterial({ color: '#6e523c', roughness: 0.9 })
export const woodDark = new MeshStandardMaterial({ color: '#4c392b', roughness: 0.9 })
export const metalDark = new MeshStandardMaterial({ color: '#26242a', roughness: 0.6, metalness: 0.4 })
export const metalMid = new MeshStandardMaterial({ color: '#4a4850', roughness: 0.5, metalness: 0.5 })
export const plasticBlack = new MeshStandardMaterial({ color: '#1b1a1f', roughness: 0.7 })
export const plasticWhite = new MeshStandardMaterial({ color: '#c9c4bb', roughness: 0.8 })
export const cardboard = new MeshStandardMaterial({ color: '#8a6f52', roughness: 1 })
export const fabric = new MeshStandardMaterial({ color: '#3c3a42', roughness: 1 })
export const rugFabric = new MeshStandardMaterial({ color: '#4a2a1c', roughness: 1 })
export const accentPaint = new MeshStandardMaterial({ color: ACCENT, roughness: 0.75 })
export const wallPaint = new MeshStandardMaterial({ color: '#232227', roughness: 1 })
export const ceilingPaint = new MeshStandardMaterial({ color: '#141317', roughness: 1 })

export const lampEmissive = new MeshStandardMaterial({
  color: '#2c2a26',
  emissive: new Color('#ffd9a8'),
  emissiveIntensity: 0.9,
  roughness: 0.8,
})
// Emissive pushed past 1.0 so the bloom pass (threshold 0.85) picks the
// lintel up as a glowing sign while lit surfaces stay clean.
export const accentEmissive = new MeshStandardMaterial({
  color: '#3a1c0e',
  emissive: new Color(ACCENT),
  emissiveIntensity: 1.0,
  roughness: 0.8,
})
// HDR color (>1) — blooms as a hot filament without washing out the shade.
export const bulbWarm = new MeshBasicMaterial({ toneMapped: false })
bulbWarm.color.setRGB(2.1, 1.75, 1.25)

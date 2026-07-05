import { useTexture } from '@react-three/drei'
import { MirroredRepeatWrapping, SRGBColorSpace, type Texture } from 'three'

import whiteboardUrl from '../assets/tex/whiteboard.webp'
import screenAUrl from '../assets/tex/screen-desk-a.webp'
import screenBUrl from '../assets/tex/screen-desk-b.webp'
import screenCUrl from '../assets/tex/screen-desk-c.webp'
import screenMinjiUrl from '../assets/tex/screen-minji.webp'
import corkboardUrl from '../assets/tex/corkboard.webp'
import posterShipUrl from '../assets/tex/poster-ship.webp'
import posterGridUrl from '../assets/tex/poster-grid.webp'
import doorSignUrl from '../assets/tex/door-sign.webp'
import floorUrl from '../assets/tex/floor-concrete.webp'
import clockUrl from '../assets/tex/clock-247.webp'
import nameplateUrl from '../assets/tex/nameplate.webp'
import skylightUrl from '../assets/tex/skylight.webp'

export const TEX = {
  whiteboard: whiteboardUrl,
  screenA: screenAUrl,
  screenB: screenBUrl,
  screenC: screenCUrl,
  screenMinji: screenMinjiUrl,
  corkboard: corkboardUrl,
  posterShip: posterShipUrl,
  posterGrid: posterGridUrl,
  doorSign: doorSignUrl,
  floor: floorUrl,
  clock: clockUrl,
  nameplate: nameplateUrl,
  skylight: skylightUrl,
} as const

export type TexKey = keyof typeof TEX

/** All 12 textures total ~150KB — no lazy gating needed, preload the lot. */
Object.values(TEX).forEach((url) => useTexture.preload(url))

export function useSrgbTexture(key: TexKey): Texture {
  const t = useTexture(TEX[key])
  t.colorSpace = SRGBColorSpace
  return t
}

export function useFloorTexture(): Texture {
  const t = useTexture(TEX.floor)
  t.colorSpace = SRGBColorSpace
  t.wrapS = t.wrapT = MirroredRepeatWrapping
  t.repeat.set(3, 16)
  t.anisotropy = 4
  return t
}

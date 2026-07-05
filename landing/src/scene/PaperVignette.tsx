import { useMemo, type RefObject } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { MeshBasicMaterial, SRGBColorSpace, TextureLoader } from 'three'
import bgUrl from '../assets/paper/paper-bg.webp'
import heroUrl from '../assets/paper/paper-hero.webp'
import fgUrl from '../assets/paper/paper-fg.webp'

/**
 * Paper Garage proof-of-look: three illustrated SVG layers mounted as
 * depth-separated planes. Scroll drives a gentle lateral camera drift so
 * the layers parallax against each other; the shared post stack (bloom,
 * grain, vignette) does the atmosphere.
 */
export function PaperVignette({ progressRef }: { progressRef: RefObject<number> }) {
  const [bg, hero, fg] = useLoader(TextureLoader, [bgUrl, heroUrl, fgUrl])
  const mats = useMemo(() => {
    for (const t of [bg, hero, fg]) t.colorSpace = SRGBColorSpace
    return {
      bg: new MeshBasicMaterial({ map: bg, toneMapped: false }),
      hero: new MeshBasicMaterial({ map: hero, transparent: true, toneMapped: false }),
      fg: new MeshBasicMaterial({ map: fg, transparent: true, toneMapped: false }),
    }
  }, [bg, hero, fg])

  useFrame(({ camera, clock }) => {
    const p = progressRef.current
    camera.position.x = (p - 0.5) * 1.6
    camera.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.03
    camera.position.z = 5
    camera.lookAt((p - 0.5) * 1.1, 0, 0)
  })

  return (
    <group>
      <mesh position={[0, 0.4, -6]} material={mats.bg}>
        <planeGeometry args={[19.5, 10.97]} />
      </mesh>
      <mesh position={[0, -0.55, -2.6]} material={mats.hero}>
        <planeGeometry args={[9.6, 6]} />
      </mesh>
      <mesh position={[0, -1.1, -0.6]} material={mats.fg}>
        <planeGeometry args={[10.8, 6.75]} />
      </mesh>
    </group>
  )
}

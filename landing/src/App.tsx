import { Suspense, lazy } from 'react'
import { GarageGame } from './game/GarageGame'

/**
 * The escape-room game is the site. The legacy scroll-rail prototypes
 * (?rail = 3D workshop, ?paper = 2.5D vignette) stay reachable for
 * reference but are code-split so the game path never downloads three.js.
 */
const LEGACY =
  typeof window !== 'undefined' &&
  (() => {
    const q = new URLSearchParams(window.location.search)
    return q.has('rail') || q.has('paper')
  })()

const RailApp = lazy(() => import('./RailApp'))

export default function App() {
  if (LEGACY) {
    return (
      <Suspense fallback={null}>
        <RailApp />
      </Suspense>
    )
  }
  return <GarageGame />
}

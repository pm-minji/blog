import { GarageScene } from './scene/GarageScene'
import { Overlay } from './ui/Overlay'
import { useGarageScroll } from './scroll/useGarageScroll'
import { STOP_COUNT } from './content/stations'

/** 130vh of scroll travel per rail segment, plus the viewport itself. */
const SPACER_HEIGHT = `${(STOP_COUNT - 1) * 130 + 100}vh`

export default function App() {
  const { progressRef, activeStation, scrollToStation } = useGarageScroll()

  return (
    <>
      <div className="scroll-spacer" style={{ height: SPACER_HEIGHT }} aria-hidden="true" />
      <div className="scene">
        <GarageScene progressRef={progressRef} />
      </div>
      <Overlay activeStation={activeStation} onDotClick={scrollToStation} />
    </>
  )
}

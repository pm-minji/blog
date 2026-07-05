import { STATIONS } from '../content/stations'
import { Shell, EntranceFacade, Posters } from './shell/Shell'
import { WhiteboardStation, ProjectDesk, MinjiCorner, type DeskConfig } from './stations/Stations'
import { BoxPiles } from './props/Props'
import { DustMotes } from './fx/Fakes'

/** Visual config per project-desk station, keyed by station id. */
const DESKS: Record<string, Omit<DeskConfig, 'z'>> = {
  'desk-1': { side: 'right', screen: 'screenA', prototype: 'gadget' },
  'desk-2': { side: 'left', screen: 'screenB', prototype: 'device', flicker: true, cool: true },
  'desk-3': { side: 'right', screen: 'screenC', prototype: 'box' },
}

export function Workshop() {
  return (
    <group>
      <Shell />
      <EntranceFacade />
      <Posters />
      {STATIONS.map((s) => {
        if (s.id === 'whiteboard') return <WhiteboardStation key={s.id} z={s.z} />
        if (s.id === 'minji-desk') return <MinjiCorner key={s.id} z={s.z} />
        const cfg = DESKS[s.id]
        return cfg ? <ProjectDesk key={s.id} z={s.z} {...cfg} /> : null
      })}
      <BoxPiles />
      <DustMotes />
    </group>
  )
}

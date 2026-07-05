import { STATIONS } from '../content/stations'

const ACCENT = '#ff5a1f'
const WALL = '#3a3a40'
const FLOOR = '#2b2b30'
const PROP = '#55555e'
const PROP_DARK = '#44444c'

/** Hall runs from z=8 (entrance) to z=-42 (back wall), 9 units wide. */
const HALL = { width: 9, height: 3.6, zStart: 8, zEnd: -42 }
const HALL_LENGTH = HALL.zStart - HALL.zEnd
const HALL_CENTER_Z = (HALL.zStart + HALL.zEnd) / 2

function Shell() {
  return (
    <group>
      <mesh position={[0, -0.1, HALL_CENTER_Z + 3]}>
        <boxGeometry args={[HALL.width + 1, 0.2, HALL_LENGTH + 10]} />
        <meshStandardMaterial color={FLOOR} />
      </mesh>
      <mesh position={[-HALL.width / 2, HALL.height / 2, HALL_CENTER_Z]}>
        <boxGeometry args={[0.3, HALL.height, HALL_LENGTH]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[HALL.width / 2, HALL.height / 2, HALL_CENTER_Z]}>
        <boxGeometry args={[0.3, HALL.height, HALL_LENGTH]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[0, HALL.height, HALL_CENTER_Z]}>
        <boxGeometry args={[HALL.width, 0.2, HALL_LENGTH]} />
        <meshStandardMaterial color={PROP_DARK} />
      </mesh>
      <mesh position={[0, HALL.height / 2, HALL.zEnd]}>
        <boxGeometry args={[HALL.width, HALL.height, 0.3]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
    </group>
  )
}

function EntranceFacade() {
  const doorWidth = 6
  const stubWidth = (HALL.width - doorWidth) / 2
  return (
    <group position={[0, 0, HALL.zStart - 3]}>
      <mesh position={[-(doorWidth + stubWidth) / 2, HALL.height / 2, 0]}>
        <boxGeometry args={[stubWidth, HALL.height, 0.35]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[(doorWidth + stubWidth) / 2, HALL.height / 2, 0]}>
        <boxGeometry args={[stubWidth, HALL.height, 0.35]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[0, HALL.height - 0.35, 0]}>
        <boxGeometry args={[HALL.width, 0.7, 0.35]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[0, HALL.height - 0.78, 0]}>
        <boxGeometry args={[doorWidth, 0.16, 0.4]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, HALL.height - 1.05, -0.1]}>
        <boxGeometry args={[doorWidth - 0.2, 0.42, 0.5]} />
        <meshStandardMaterial color={PROP_DARK} />
      </mesh>
    </group>
  )
}

function LightStrips() {
  const zs = [0, -8, -16, -24, -32]
  return (
    <group>
      {zs.map((z) => (
        <mesh key={z} position={[0, HALL.height - 0.08, z]}>
          <boxGeometry args={[3.5, 0.06, 0.5]} />
          <meshStandardMaterial
            color="#fff2e3"
            emissive="#fff2e3"
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function WelcomeSign({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 3.1, 0]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color={PROP} />
        </mesh>
      ))}
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[1.8, 0.7, 0.08]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function CarLift({ z, side }: { z: number; side: 'left' | 'right' }) {
  const x = side === 'right' ? 2.2 : -2.2
  return (
    <group position={[x, 0, z]} rotation={[0, side === 'right' ? -0.35 : 0.35, 0]}>
      {[-1.35, 1.35].flatMap((px) =>
        [-0.62, 0.62].map((pz) => (
          <mesh key={`${px}:${pz}`} position={[px, 0.3, pz]}>
            <boxGeometry args={[0.18, 0.6, 0.18]} />
            <meshStandardMaterial color={PROP_DARK} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[3.2, 0.12, 1.6]} />
        <meshStandardMaterial color={PROP} />
      </mesh>
      {[-0.95, 0.95].flatMap((px) =>
        [-0.55, 0.55].map((pz) => (
          <mesh key={`${px}:${pz}`} position={[px, 1.0, pz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 12]} />
            <meshStandardMaterial color="#1d1d21" />
          </mesh>
        )),
      )}
      <mesh position={[0, 1.28, 0]}>
        <boxGeometry args={[2.7, 0.55, 1.15]} />
        <meshStandardMaterial color={ACCENT} flatShading />
      </mesh>
      <mesh position={[-0.25, 1.78, 0]}>
        <boxGeometry args={[1.35, 0.45, 1.0]} />
        <meshStandardMaterial color="#d84a15" flatShading />
      </mesh>
    </group>
  )
}

function Workbench({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.4, 0.12, 1.1]} />
        <meshStandardMaterial color={PROP} />
      </mesh>
      {[-1.5, 1.5].map((px) => (
        <mesh key={px} position={[px, 0.2, 0]}>
          <boxGeometry args={[0.16, 0.4, 0.9]} />
          <meshStandardMaterial color={PROP_DARK} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, -0.5]}>
        <boxGeometry args={[3.4, 1.9, 0.08]} />
        <meshStandardMaterial color={PROP_DARK} />
      </mesh>
      <mesh position={[-0.7, 0.75, 0.1]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color={ACCENT} />
      </mesh>
      <mesh position={[0.8, 0.66, 0.05]}>
        <boxGeometry args={[0.6, 0.3, 0.5]} />
        <meshStandardMaterial color="#66666f" />
      </mesh>
    </group>
  )
}

function Clutter() {
  const crates: Array<[number, number, number]> = [
    [-3.7, 0.35, -5],
    [-3.6, 0.3, -13.5],
    [3.7, 0.35, -22],
    [3.6, 0.3, -30],
    [-3.7, 0.35, -31],
    [3.8, 0.35, -6.5],
  ]
  return (
    <group>
      {crates.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, (i * 0.7) % 1, 0]}>
          <boxGeometry args={[0.7, y * 2, 0.7]} />
          <meshStandardMaterial color={i % 2 ? PROP : PROP_DARK} />
        </mesh>
      ))}
      <mesh position={[3.6, 0.45, -14.5]}>
        <cylinderGeometry args={[0.32, 0.32, 0.9, 10]} />
        <meshStandardMaterial color={PROP} />
      </mesh>
      <mesh position={[-3.6, 0.45, -23.5]}>
        <cylinderGeometry args={[0.32, 0.32, 0.9, 10]} />
        <meshStandardMaterial color="#d84a15" />
      </mesh>
    </group>
  )
}

export function Blockout() {
  return (
    <group>
      <Shell />
      <EntranceFacade />
      <LightStrips />
      {STATIONS.map((s) =>
        s.id === 'welcome' ? (
          <WelcomeSign key={s.id} z={s.z} />
        ) : s.id === 'workbench' ? (
          <Workbench key={s.id} z={s.z} />
        ) : (
          <CarLift key={s.id} z={s.z} side={s.side === 'left' ? 'left' : 'right'} />
        ),
      )}
      <Clutter />
    </group>
  )
}

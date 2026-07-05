import { useMemo } from 'react'
import { AdditiveBlending, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import * as M from '../materials'
import { useFloorTexture, useSrgbTexture } from '../textures'
import { fxTextures } from '../fx/gradientTextures'

/** Hall runs from z=8 (entrance) to z=-42 (back wall), 9 units wide. */
export const HALL = { width: 9, height: 3.6, zStart: 8, zEnd: -42 }
const HALL_LENGTH = HALL.zStart - HALL.zEnd
const HALL_CENTER_Z = (HALL.zStart + HALL.zEnd) / 2

export function Shell() {
  const floorTex = useFloorTexture()
  const floorMat = useMemo(
    () => new MeshStandardMaterial({ map: floorTex, color: '#8f8b90', roughness: 1 }),
    [floorTex],
  )
  return (
    <group>
      <mesh position={[0, -0.1, HALL_CENTER_Z + 3]} material={floorMat}>
        <boxGeometry args={[HALL.width + 1, 0.2, HALL_LENGTH + 10]} />
      </mesh>
      <mesh position={[-HALL.width / 2, HALL.height / 2, HALL_CENTER_Z]} material={M.wallPaint}>
        <boxGeometry args={[0.3, HALL.height, HALL_LENGTH]} />
      </mesh>
      <mesh position={[HALL.width / 2, HALL.height / 2, HALL_CENTER_Z]} material={M.wallPaint}>
        <boxGeometry args={[0.3, HALL.height, HALL_LENGTH]} />
      </mesh>
      <mesh position={[0, HALL.height, HALL_CENTER_Z]} material={M.ceilingPaint}>
        <boxGeometry args={[HALL.width, 0.2, HALL_LENGTH]} />
      </mesh>
      <mesh position={[0, HALL.height / 2, HALL.zEnd]} material={M.wallPaint}>
        <boxGeometry args={[HALL.width, HALL.height, 0.3]} />
      </mesh>
    </group>
  )
}

export function Posters() {
  const ship = useSrgbTexture('posterShip')
  const grid = useSrgbTexture('posterGrid')
  const shipMat = useMemo(() => new MeshBasicMaterial({ map: ship, toneMapped: false, color: '#8f8a84' }), [ship])
  const gridMat = useMemo(() => new MeshBasicMaterial({ map: grid, toneMapped: false, color: '#7f7a74' }), [grid])
  return (
    <group>
      <mesh position={[HALL.width / 2 - 0.16, 1.8, -7.2]} rotation={[0, -Math.PI / 2, 0.02]} material={shipMat}>
        <planeGeometry args={[0.9, 1.35]} />
      </mesh>
      <mesh position={[-HALL.width / 2 + 0.16, 1.75, -22.5]} rotation={[0, Math.PI / 2, -0.015]} material={gridMat}>
        <planeGeometry args={[0.9, 1.35]} />
      </mesh>
    </group>
  )
}

export function EntranceFacade() {
  const sign = useSrgbTexture('doorSign')
  const signMat = useMemo(() => new MeshBasicMaterial({ map: sign, toneMapped: false }), [sign])
  const spillMat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: fxTextures().pool,
        color: '#ffc79a',
        transparent: true,
        opacity: 0.35,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )
  const doorWidth = 6
  const stubWidth = (HALL.width - doorWidth) / 2
  return (
    <group position={[0, 0, HALL.zStart - 3]}>
      <mesh position={[-(doorWidth + stubWidth) / 2, HALL.height / 2, 0]} material={M.wallPaint}>
        <boxGeometry args={[stubWidth, HALL.height, 0.35]} />
      </mesh>
      <mesh position={[(doorWidth + stubWidth) / 2, HALL.height / 2, 0]} material={M.wallPaint}>
        <boxGeometry args={[stubWidth, HALL.height, 0.35]} />
      </mesh>
      <mesh position={[0, HALL.height - 0.35, 0]} material={M.wallPaint}>
        <boxGeometry args={[HALL.width, 0.7, 0.35]} />
      </mesh>
      <mesh position={[0, HALL.height - 0.78, 0]} material={M.accentEmissive}>
        <boxGeometry args={[doorWidth, 0.16, 0.4]} />
      </mesh>
      <mesh position={[0, HALL.height - 1.05, -0.1]} material={M.metalDark}>
        <boxGeometry args={[doorWidth - 0.2, 0.42, 0.5]} />
      </mesh>
      <mesh position={[0, 3.24, 0.19]} material={signMat}>
        <planeGeometry args={[2.1, 0.7]} />
      </mesh>
      <mesh position={[0, 0.02, 1.6]} rotation={[-Math.PI / 2, 0, 0]} material={spillMat} renderOrder={9}>
        <planeGeometry args={[5.5, 3.2]} />
      </mesh>
    </group>
  )
}

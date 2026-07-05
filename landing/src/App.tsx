import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function SpinningCrate() {
  const mesh = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.6
    mesh.current.rotation.x += delta * 0.15
  })
  return (
    <mesh ref={mesh} position={[0, 0.4, 0]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#ff5a1f" flatShading />
    </mesh>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <circleGeometry args={[4, 48]} />
      <meshStandardMaterial color="#26262b" />
    </mesh>
  )
}

export default function App() {
  return (
    <>
      <div className="scene">
        <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.6, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 2]} intensity={1.4} />
          <SpinningCrate />
          <Floor />
        </Canvas>
      </div>
      <div className="overlay">
        <h1>PM-Minji's Garage</h1>
        <p>차고 공사 중 — 곧 문을 엽니다</p>
        <a href="/blog/">블로그 먼저 둘러보기</a>
      </div>
    </>
  )
}

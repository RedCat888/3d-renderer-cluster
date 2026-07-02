import { useCallback } from 'react'
import {
  Grid,
  Environment,
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei'
import { useStore } from '../store'
import { SceneObjectMesh } from './SceneObject'

function GroundPlane() {
  const shadowsEnabled = useStore((s) => s.shadowsEnabled)

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#111113"
          roughness={0.85}
          metalness={0}
          transparent
          opacity={0.95}
        />
      </mesh>
      {shadowsEnabled && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={20}
          blur={2}
          far={10}
          color="#000000"
        />
      )}
    </>
  )
}

export function Scene() {
  const objects = useStore((s) => s.objects)
  const showGrid = useStore((s) => s.showGrid)
  const showAxes = useStore((s) => s.showAxes)
  const environmentPreset = useStore((s) => s.environmentPreset)
  const environmentIntensity = useStore((s) => s.environmentIntensity)
  const environmentBackground = useStore((s) => s.environmentBackground)
  const selectObject = useStore((s) => s.selectObject)

  const handleMiss = useCallback(() => {
    selectObject(null)
  }, [selectObject])

  return (
    <>
      <Environment
        preset={environmentPreset}
        environmentIntensity={environmentIntensity}
        background={environmentBackground}
      />

      <GroundPlane />

      {showGrid && (
        <Grid
          position={[0, 0.001, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#27272a"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#3f3f46"
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {showAxes && <axesHelper args={[5]} />}

      <group onPointerMissed={handleMiss}>
        {objects.map((obj) => (
          <SceneObjectMesh key={obj.id} obj={obj} />
        ))}
      </group>

      <GizmoHelper alignment="bottom-left" margin={[70, 70]}>
        <GizmoViewport
          axisColors={['#ef4444', '#22c55e', '#3b82f6']}
          labelColor="#ffffff"
        />
      </GizmoHelper>
    </>
  )
}

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useStore } from '../store'

const cameraPresets: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  default: { position: [5, 4, 6], target: [0, 1, 0] },
  front: { position: [0, 2, 8], target: [0, 1, 0] },
  top: { position: [0, 10, 0.01], target: [0, 0, 0] },
  side: { position: [8, 2, 0], target: [0, 1, 0] },
  closeup: { position: [2, 2, 3], target: [0, 1.2, 0] },
  wide: { position: [10, 6, 10], target: [0, 0, 0] },
  low: { position: [4, 0.5, 4], target: [0, 1, 0] },
  dramatic: { position: [3, 5, -4], target: [0, 1, 0] },
}

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsType>(null)
  const { camera } = useThree()

  const fov = useStore((s) => s.cameraFov)
  const near = useStore((s) => s.cameraNear)
  const far = useStore((s) => s.cameraFar)
  const autoRotate = useStore((s) => s.autoRotate)
  const autoRotateSpeed = useStore((s) => s.autoRotateSpeed)
  const cameraPreset = useStore((s) => s.cameraPreset)
  const turntableEnabled = useStore((s) => s.turntableEnabled)
  const turntableSpeed = useStore((s) => s.turntableSpeed)

  useEffect(() => {
    if ('fov' in camera) {
      (camera as any).fov = fov;
      (camera as any).near = near;
      (camera as any).far = far;
      (camera as any).updateProjectionMatrix()
    }
  }, [camera, fov, near, far])

  useEffect(() => {
    const preset = cameraPresets[cameraPreset]
    if (preset && controlsRef.current) {
      camera.position.set(...preset.position)
      controlsRef.current.target.set(...preset.target)
      controlsRef.current.update()
    }
  }, [cameraPreset, camera])

  useFrame((_, delta) => {
    if (turntableEnabled && controlsRef.current) {
      const speed = turntableSpeed * delta
      const angle = speed * 0.5
      const x = camera.position.x * Math.cos(angle) - camera.position.z * Math.sin(angle)
      const z = camera.position.x * Math.sin(angle) + camera.position.z * Math.cos(angle)
      camera.position.x = x
      camera.position.z = z
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.5}
      maxDistance={50}
      target={[0, 1, 0]}
      maxPolarAngle={Math.PI * 0.85}
    />
  )
}

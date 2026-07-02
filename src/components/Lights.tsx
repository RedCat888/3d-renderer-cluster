import { useStore } from '../store'
import type { LightConfig } from '../types'

function LightFromConfig({ light }: { light: LightConfig }) {
  if (!light.visible) return null

  switch (light.type) {
    case 'directional':
      return (
        <directionalLight
          position={light.position}
          color={light.color}
          intensity={light.intensity}
          castShadow={light.castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
        />
      )
    case 'point':
      return (
        <pointLight
          position={light.position}
          color={light.color}
          intensity={light.intensity}
          castShadow={light.castShadow}
          distance={light.distance ?? 0}
          decay={light.decay ?? 2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
        />
      )
    case 'spot':
      return (
        <spotLight
          position={light.position}
          color={light.color}
          intensity={light.intensity}
          castShadow={light.castShadow}
          angle={light.angle ?? 0.5}
          penumbra={light.penumbra ?? 0.5}
          distance={light.distance ?? 0}
          decay={light.decay ?? 2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
      )
    default:
      return null
  }
}

export function SceneLights() {
  const lights = useStore((s) => s.lights)
  const ambientIntensity = useStore((s) => s.ambientIntensity)
  const ambientColor = useStore((s) => s.ambientColor)

  return (
    <>
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      {lights.map((light) => (
        <LightFromConfig key={light.id} light={light} />
      ))}
    </>
  )
}

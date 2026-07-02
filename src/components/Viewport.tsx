import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  AgXToneMapping,
  NeutralToneMapping,
  Color,
} from 'three'
import { Preload } from '@react-three/drei'
import { EffectComposer, Bloom, SSAO, Vignette, SMAA } from '@react-three/postprocessing'
import { useStore } from '../store'
import { Scene } from './Scene'
import { SceneLights } from './Lights'
import { CameraRig } from './CameraRig'
import { ViewportToolbar } from './ViewportToolbar'

const toneMappingMap = {
  ACESFilmic: ACESFilmicToneMapping,
  Reinhard: ReinhardToneMapping,
  Cineon: CineonToneMapping,
  Linear: LinearToneMapping,
  AgX: AgXToneMapping,
  Neutral: NeutralToneMapping,
} as const

function BloomEffect() {
  const bloomIntensity = useStore((s) => s.bloomIntensity)
  const bloomThreshold = useStore((s) => s.bloomThreshold)
  return (
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.9}
      mipmapBlur
    />
  )
}

function SSAOEffect() {
  return (
    <SSAO
      radius={0.1}
      intensity={15}
      luminanceInfluence={0.6}
      color={new Color('#000000')}
    />
  )
}

function VignetteEffect() {
  return <Vignette offset={0.3} darkness={0.6} />
}

function PostProcessing() {
  const bloomEnabled = useStore((s) => s.bloomEnabled)
  const ssaoEnabled = useStore((s) => s.ssaoEnabled)
  const vignetteEnabled = useStore((s) => s.vignetteEnabled)

  const effects: React.ReactNode[] = [<SMAA key="smaa" />]
  if (bloomEnabled) effects.push(<BloomEffect key="bloom" />)
  if (ssaoEnabled) effects.push(<SSAOEffect key="ssao" />)
  if (vignetteEnabled) effects.push(<VignetteEffect key="vignette" />)

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      {effects as any}
    </EffectComposer>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null)

  const toneMapping = useStore((s) => s.toneMapping)
  const exposure = useStore((s) => s.exposure)
  const pixelRatio = useStore((s) => s.pixelRatio)
  const shadowsEnabled = useStore((s) => s.shadowsEnabled)
  const backgroundColor = useStore((s) => s.backgroundColor)

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={pixelRatio}
        shadows={shadowsEnabled}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          toneMapping: toneMappingMap[toneMapping] ?? ACESFilmicToneMapping,
          toneMappingExposure: exposure,
        }}
        camera={{ position: [5, 4, 6], fov: 45, near: 0.1, far: 1000 }}
        style={{ background: backgroundColor }}
        id="render-canvas"
        eventSource={containerRef as any}
        eventPrefix="client"
      >
        <Suspense fallback={<LoadingFallback />}>
          <CameraRig />
          <SceneLights />
          <Scene />
          <PostProcessing />
          <Preload all />
        </Suspense>
      </Canvas>
      <ViewportToolbar />
    </div>
  )
}

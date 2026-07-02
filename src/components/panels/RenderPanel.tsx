import { useStore } from '../../store'
import { Section, Slider, Toggle, Select } from '../ui/Controls'

const toneMappingOptions = [
  { value: 'ACESFilmic', label: 'ACES Filmic' },
  { value: 'Reinhard', label: 'Reinhard' },
  { value: 'Cineon', label: 'Cineon' },
  { value: 'Linear', label: 'Linear' },
  { value: 'AgX', label: 'AgX' },
  { value: 'Neutral', label: 'Neutral' },
]

export function RenderPanel() {
  const toneMapping = useStore((s) => s.toneMapping)
  const setToneMapping = useStore((s) => s.setToneMapping)
  const exposure = useStore((s) => s.exposure)
  const setExposure = useStore((s) => s.setExposure)

  const bloomEnabled = useStore((s) => s.bloomEnabled)
  const setBloomEnabled = useStore((s) => s.setBloomEnabled)
  const bloomIntensity = useStore((s) => s.bloomIntensity)
  const setBloomIntensity = useStore((s) => s.setBloomIntensity)
  const bloomThreshold = useStore((s) => s.bloomThreshold)
  const setBloomThreshold = useStore((s) => s.setBloomThreshold)

  const ssaoEnabled = useStore((s) => s.ssaoEnabled)
  const setSsaoEnabled = useStore((s) => s.setSsaoEnabled)
  const vignetteEnabled = useStore((s) => s.vignetteEnabled)
  const setVignetteEnabled = useStore((s) => s.setVignetteEnabled)
  const fxaaEnabled = useStore((s) => s.fxaaEnabled)
  const setFxaaEnabled = useStore((s) => s.setFxaaEnabled)

  const pixelRatio = useStore((s) => s.pixelRatio)
  const setPixelRatio = useStore((s) => s.setPixelRatio)

  const animationPlaying = useStore((s) => s.animationPlaying)
  const setAnimationPlaying = useStore((s) => s.setAnimationPlaying)
  const animationSpeed = useStore((s) => s.animationSpeed)
  const setAnimationSpeed = useStore((s) => s.setAnimationSpeed)

  return (
    <div className="flex flex-col gap-1">
      <Section title="Tone Mapping">
        <Select
          label="Algorithm"
          value={toneMapping}
          options={toneMappingOptions}
          onChange={(v) => setToneMapping(v as any)}
        />
        <Slider label="Exposure" value={exposure} min={0.1} max={4} step={0.05} onChange={setExposure} />
      </Section>

      <Section title="Bloom">
        <Toggle label="Enabled" value={bloomEnabled} onChange={setBloomEnabled} />
        {bloomEnabled && (
          <>
            <Slider label="Intensity" value={bloomIntensity} min={0} max={3} step={0.05} onChange={setBloomIntensity} />
            <Slider label="Threshold" value={bloomThreshold} min={0} max={1} step={0.01} onChange={setBloomThreshold} />
          </>
        )}
      </Section>

      <Section title="Effects">
        <Toggle label="Ambient Occlusion" value={ssaoEnabled} onChange={setSsaoEnabled} />
        <Toggle label="Vignette" value={vignetteEnabled} onChange={setVignetteEnabled} />
        <Toggle label="Anti-Aliasing (SMAA)" value={fxaaEnabled} onChange={setFxaaEnabled} />
      </Section>

      <Section title="Performance">
        <Slider
          label="Pixel Ratio"
          value={pixelRatio}
          min={0.5}
          max={Math.min(window.devicePixelRatio, 3)}
          step={0.25}
          onChange={setPixelRatio}
          suffix="x"
        />
      </Section>

      <Section title="Animation">
        <Toggle label="Playing" value={animationPlaying} onChange={setAnimationPlaying} />
        <Slider
          label="Global Speed"
          value={animationSpeed}
          min={0}
          max={5}
          step={0.1}
          onChange={setAnimationSpeed}
          suffix="x"
        />
      </Section>
    </div>
  )
}

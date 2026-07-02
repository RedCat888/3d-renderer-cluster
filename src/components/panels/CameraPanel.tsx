import { useStore } from '../../store'
import { Section, Slider, Toggle, Select, Button } from '../ui/Controls'

const cameraPresetOptions = [
  { value: 'default', label: 'Default 3/4' },
  { value: 'front', label: 'Front' },
  { value: 'top', label: 'Top Down' },
  { value: 'side', label: 'Side' },
  { value: 'closeup', label: 'Close Up' },
  { value: 'wide', label: 'Wide' },
  { value: 'low', label: 'Low Angle' },
  { value: 'dramatic', label: 'Dramatic' },
]

export function CameraPanel() {
  const fov = useStore((s) => s.cameraFov)
  const setFov = useStore((s) => s.setCameraFov)
  const near = useStore((s) => s.cameraNear)
  const setNear = useStore((s) => s.setCameraNear)
  const far = useStore((s) => s.cameraFar)
  const setFar = useStore((s) => s.setCameraFar)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const autoRotateSpeed = useStore((s) => s.autoRotateSpeed)
  const setAutoRotateSpeed = useStore((s) => s.setAutoRotateSpeed)
  const cameraPreset = useStore((s) => s.cameraPreset)
  const setCameraPreset = useStore((s) => s.setCameraPreset)
  const turntableEnabled = useStore((s) => s.turntableEnabled)
  const setTurntableEnabled = useStore((s) => s.setTurntableEnabled)
  const turntableSpeed = useStore((s) => s.turntableSpeed)
  const setTurntableSpeed = useStore((s) => s.setTurntableSpeed)

  return (
    <div className="flex flex-col gap-1">
      <Section title="Camera Presets">
        <div className="grid grid-cols-2 gap-1">
          {cameraPresetOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCameraPreset(opt.value)}
              className={`px-2 py-1.5 rounded-md text-xs transition-all
                ${
                  cameraPreset === opt.value
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Lens">
        <Slider label="Field of View" value={fov} min={10} max={120} step={1} onChange={setFov} suffix="°" />
        <Slider label="Near Clip" value={near} min={0.01} max={10} step={0.01} onChange={setNear} />
        <Slider label="Far Clip" value={far} min={10} max={5000} step={10} onChange={setFar} />
      </Section>

      <Section title="Motion">
        <Toggle label="Auto Rotate" value={autoRotate} onChange={setAutoRotate} />
        {autoRotate && (
          <Slider label="Rotate Speed" value={autoRotateSpeed} min={0.1} max={10} step={0.1} onChange={setAutoRotateSpeed} />
        )}
        <Toggle label="Turntable Mode" value={turntableEnabled} onChange={setTurntableEnabled} />
        {turntableEnabled && (
          <Slider label="Turntable Speed" value={turntableSpeed} min={0.1} max={5} step={0.1} onChange={setTurntableSpeed} />
        )}
      </Section>
    </div>
  )
}

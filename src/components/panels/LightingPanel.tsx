import { Plus, Trash2, Eye, EyeOff, Sun, Lightbulb, Zap } from 'lucide-react'
import { useStore } from '../../store'
import {
  Section,
  Slider,
  Toggle,
  Select,
  ColorInput,
  Vec3Input,
} from '../ui/Controls'
import type { LightConfig } from '../../types'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const environmentOptions = [
  { value: 'studio', label: 'Studio' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'night', label: 'Night' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'forest', label: 'Forest' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'city', label: 'City' },
  { value: 'park', label: 'Park' },
  { value: 'lobby', label: 'Lobby' },
]

const lightTypeIcon = {
  directional: Sun,
  point: Lightbulb,
  spot: Zap,
}

export function LightingPanel() {
  const lights = useStore((s) => s.lights)
  const selectedLightId = useStore((s) => s.selectedLightId)
  const selectLight = useStore((s) => s.selectLight)
  const updateLight = useStore((s) => s.updateLight)
  const addLight = useStore((s) => s.addLight)
  const removeLight = useStore((s) => s.removeLight)

  const ambientIntensity = useStore((s) => s.ambientIntensity)
  const setAmbientIntensity = useStore((s) => s.setAmbientIntensity)
  const ambientColor = useStore((s) => s.ambientColor)
  const setAmbientColor = useStore((s) => s.setAmbientColor)
  const environmentPreset = useStore((s) => s.environmentPreset)
  const setEnvironmentPreset = useStore((s) => s.setEnvironmentPreset)
  const environmentIntensity = useStore((s) => s.environmentIntensity)
  const setEnvironmentIntensity = useStore((s) => s.setEnvironmentIntensity)
  const environmentBackground = useStore((s) => s.environmentBackground)
  const setEnvironmentBackground = useStore((s) => s.setEnvironmentBackground)
  const shadowsEnabled = useStore((s) => s.shadowsEnabled)
  const setShadowsEnabled = useStore((s) => s.setShadowsEnabled)

  const selectedLight = lights.find((l) => l.id === selectedLightId)

  const handleAddLight = (type: LightConfig['type']) => {
    const light: LightConfig = {
      id: uid(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Light`,
      type,
      position: [2, 4, 2],
      color: '#ffffff',
      intensity: type === 'directional' ? 1.5 : type === 'point' ? 15 : 30,
      castShadow: type !== 'point',
      visible: true,
      ...(type === 'spot' && { angle: 0.5, penumbra: 0.7, distance: 15, decay: 2 }),
      ...(type === 'point' && { distance: 10, decay: 2 }),
    }
    addLight(light)
    selectLight(light.id)
  }

  return (
    <div className="flex flex-col gap-1">
      <Section title="Environment">
        <Select
          label="HDRI Preset"
          value={environmentPreset}
          options={environmentOptions}
          onChange={(v) => setEnvironmentPreset(v as any)}
        />
        <Slider label="Env Intensity" value={environmentIntensity} min={0} max={3} step={0.05} onChange={setEnvironmentIntensity} />
        <Toggle label="Show as Background" value={environmentBackground} onChange={setEnvironmentBackground} />
      </Section>

      <Section title="Ambient">
        <Slider label="Intensity" value={ambientIntensity} min={0} max={2} step={0.01} onChange={setAmbientIntensity} />
        <ColorInput label="Color" value={ambientColor} onChange={setAmbientColor} />
      </Section>

      <Section title="Shadows">
        <Toggle label="Enabled" value={shadowsEnabled} onChange={setShadowsEnabled} />
      </Section>

      <Section title="Lights">
        <div className="flex gap-1 mb-1">
          <button
            onClick={() => handleAddLight('directional')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md
              bg-zinc-800/50 border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-400
              hover:text-zinc-200 transition-all"
          >
            <Sun className="w-3 h-3" /> Dir
          </button>
          <button
            onClick={() => handleAddLight('point')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md
              bg-zinc-800/50 border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-400
              hover:text-zinc-200 transition-all"
          >
            <Lightbulb className="w-3 h-3" /> Point
          </button>
          <button
            onClick={() => handleAddLight('spot')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md
              bg-zinc-800/50 border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-400
              hover:text-zinc-200 transition-all"
          >
            <Zap className="w-3 h-3" /> Spot
          </button>
        </div>

        <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto">
          {lights.map((light) => {
            const Icon = lightTypeIcon[light.type]
            return (
              <div
                key={light.id}
                onClick={() => selectLight(light.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all text-xs
                  ${
                    selectedLightId === light.id
                      ? 'bg-accent/10 border border-accent/30 text-zinc-100'
                      : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: light.color }}
                />
                <span className="flex-1 truncate">{light.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateLight(light.id, { visible: !light.visible })
                  }}
                  className="p-0.5 hover:text-zinc-100"
                >
                  {light.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeLight(light.id)
                  }}
                  className="p-0.5 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      </Section>

      {selectedLight && (
        <Section title={`Edit: ${selectedLight.name}`}>
          <ColorInput
            label="Color"
            value={selectedLight.color}
            onChange={(c) => updateLight(selectedLight.id, { color: c })}
          />
          <Slider
            label="Intensity"
            value={selectedLight.intensity}
            min={0}
            max={selectedLight.type === 'directional' ? 10 : 100}
            step={0.1}
            onChange={(v) => updateLight(selectedLight.id, { intensity: v })}
          />
          <Vec3Input
            label="Position"
            value={selectedLight.position}
            onChange={(v) => updateLight(selectedLight.id, { position: v })}
          />
          <Toggle
            label="Cast Shadow"
            value={selectedLight.castShadow}
            onChange={(v) => updateLight(selectedLight.id, { castShadow: v })}
          />
          {selectedLight.type === 'spot' && (
            <>
              <Slider
                label="Angle"
                value={selectedLight.angle ?? 0.5}
                min={0.01}
                max={1.57}
                step={0.01}
                onChange={(v) => updateLight(selectedLight.id, { angle: v })}
              />
              <Slider
                label="Penumbra"
                value={selectedLight.penumbra ?? 0.5}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateLight(selectedLight.id, { penumbra: v })}
              />
            </>
          )}
          {(selectedLight.type === 'point' || selectedLight.type === 'spot') && (
            <>
              <Slider
                label="Distance"
                value={selectedLight.distance ?? 0}
                min={0}
                max={50}
                step={0.5}
                onChange={(v) => updateLight(selectedLight.id, { distance: v })}
              />
              <Slider
                label="Decay"
                value={selectedLight.decay ?? 2}
                min={0}
                max={5}
                step={0.1}
                onChange={(v) => updateLight(selectedLight.id, { decay: v })}
              />
            </>
          )}
        </Section>
      )}
    </div>
  )
}

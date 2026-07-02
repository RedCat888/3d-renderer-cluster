import { useStore } from '../../store'
import { Section, Slider, Toggle, ColorInput, Select, Vec3Input } from '../ui/Controls'
import { materialPresets } from '../../materials'

const presetOptions = Object.entries(materialPresets).map(([key, val]) => ({
  value: key,
  label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
}))

export function MaterialPanel() {
  const selectedObjectId = useStore((s) => s.selectedObjectId)
  const objects = useStore((s) => s.objects)
  const updateObject = useStore((s) => s.updateObject)
  const updateObjectMaterial = useStore((s) => s.updateObjectMaterial)
  const applyMaterialPreset = useStore((s) => s.applyMaterialPreset)

  const obj = objects.find((o) => o.id === selectedObjectId)

  if (!obj) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-zinc-500 text-xs">
        <p>Select an object to edit its material</p>
      </div>
    )
  }

  const mat = obj.material

  return (
    <div className="flex flex-col gap-1">
      <Section title="Object Properties">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-12">Name</span>
            <input
              type="text"
              value={obj.name}
              onChange={(e) => updateObject(obj.id, { name: e.target.value })}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200
                focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <Vec3Input
          label="Position"
          value={obj.position}
          onChange={(v) => updateObject(obj.id, { position: v })}
        />
        <Vec3Input
          label="Rotation"
          value={obj.rotation}
          onChange={(v) => updateObject(obj.id, { rotation: v })}
        />
        <Vec3Input
          label="Scale"
          value={obj.scale}
          step={0.1}
          onChange={(v) => updateObject(obj.id, { scale: v })}
        />
        <Toggle
          label="Cast Shadow"
          value={obj.castShadow}
          onChange={(v) => updateObject(obj.id, { castShadow: v })}
        />
        <Toggle
          label="Receive Shadow"
          value={obj.receiveShadow}
          onChange={(v) => updateObject(obj.id, { receiveShadow: v })}
        />
        <Select
          label="Animation"
          value={obj.animationType}
          options={[
            { value: 'none', label: 'None' },
            { value: 'rotate', label: 'Rotate' },
            { value: 'float', label: 'Float' },
            { value: 'pulse', label: 'Pulse' },
          ]}
          onChange={(v) => updateObject(obj.id, { animationType: v as any })}
        />
        {obj.animationType !== 'none' && (
          <Slider
            label="Anim Speed"
            value={obj.animationSpeed}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => updateObject(obj.id, { animationSpeed: v })}
          />
        )}
      </Section>

      <Section title="Material Presets">
        <div className="grid grid-cols-2 gap-1">
          {presetOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => applyMaterialPreset(obj.id, opt.value)}
              className={`px-2 py-1.5 rounded-md text-xs transition-all
                ${
                  mat.preset === opt.value
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Material Properties">
        <ColorInput
          label="Color"
          value={mat.color}
          onChange={(c) => updateObjectMaterial(obj.id, { color: c })}
        />
        <Slider
          label="Metalness"
          value={mat.metalness}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { metalness: v })}
        />
        <Slider
          label="Roughness"
          value={mat.roughness}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { roughness: v })}
        />
        <ColorInput
          label="Emissive"
          value={mat.emissive}
          onChange={(c) => updateObjectMaterial(obj.id, { emissive: c })}
        />
        <Slider
          label="Emissive Intensity"
          value={mat.emissiveIntensity}
          min={0}
          max={10}
          step={0.1}
          onChange={(v) => updateObjectMaterial(obj.id, { emissiveIntensity: v })}
        />
        <Slider
          label="Opacity"
          value={mat.opacity}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { opacity: v, transparent: v < 1 })}
        />
        <Toggle
          label="Wireframe"
          value={mat.wireframe}
          onChange={(v) => updateObjectMaterial(obj.id, { wireframe: v })}
        />
      </Section>

      <Section title="Advanced" defaultOpen={false}>
        <Slider
          label="Transmission"
          value={mat.transmission}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { transmission: v })}
        />
        <Slider
          label="IOR"
          value={mat.ior}
          min={1}
          max={2.5}
          step={0.01}
          onChange={(v) => updateObjectMaterial(obj.id, { ior: v })}
        />
        <Slider
          label="Thickness"
          value={mat.thickness}
          min={0}
          max={5}
          step={0.1}
          onChange={(v) => updateObjectMaterial(obj.id, { thickness: v })}
        />
        <Slider
          label="Clearcoat"
          value={mat.clearcoat}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { clearcoat: v })}
        />
        <Slider
          label="Clearcoat Roughness"
          value={mat.clearcoatRoughness}
          min={0}
          max={1}
          onChange={(v) => updateObjectMaterial(obj.id, { clearcoatRoughness: v })}
        />
        <Slider
          label="Env Map Intensity"
          value={mat.envMapIntensity}
          min={0}
          max={5}
          step={0.1}
          onChange={(v) => updateObjectMaterial(obj.id, { envMapIntensity: v })}
        />
      </Section>
    </div>
  )
}

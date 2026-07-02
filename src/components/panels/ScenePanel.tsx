import { useState } from 'react'
import {
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  Layers,
  Package,
} from 'lucide-react'
import { useStore } from '../../store'
import { Section, Toggle, Select, Button, ColorInput } from '../ui/Controls'
import { scenePresets } from '../../presets'
import { defaultMaterial, applyPreset } from '../../materials'
import type { SceneObject, GeometryType } from '../../types'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const geometryOptions: { value: GeometryType; label: string }[] = [
  { value: 'torusKnot', label: 'Torus Knot' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'box', label: 'Box' },
  { value: 'icosahedron', label: 'Icosahedron' },
  { value: 'dodecahedron', label: 'Dodecahedron' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'cone', label: 'Cone' },
  { value: 'torus', label: 'Torus' },
  { value: 'octahedron', label: 'Octahedron' },
  { value: 'capsule', label: 'Capsule' },
]

const bundledModels = [
  { name: 'Damaged Helmet', file: '/models/DamagedHelmet.glb', scale: [1, 1, 1] as [number, number, number], yOffset: 1.2 },
  { name: 'Duck', file: '/models/Duck.glb', scale: [0.01, 0.01, 0.01] as [number, number, number], yOffset: 0 },
  { name: 'Toy Car', file: '/models/ToyCar.glb', scale: [80, 80, 80] as [number, number, number], yOffset: 0.3 },
  { name: 'Avocado', file: '/models/Avocado.glb', scale: [30, 30, 30] as [number, number, number], yOffset: 0.5 },
  { name: 'Sheen Chair', file: '/models/SheenChair.glb', scale: [1, 1, 1] as [number, number, number], yOffset: 0 },
]

export function ScenePanel() {
  const [addType, setAddType] = useState<string>('torusKnot')
  const objects = useStore((s) => s.objects)
  const selectedObjectId = useStore((s) => s.selectedObjectId)
  const selectObject = useStore((s) => s.selectObject)
  const updateObject = useStore((s) => s.updateObject)
  const removeObject = useStore((s) => s.removeObject)
  const duplicateObject = useStore((s) => s.duplicateObject)
  const addObject = useStore((s) => s.addObject)
  const loadPreset = useStore((s) => s.loadPreset)
  const showGrid = useStore((s) => s.showGrid)
  const setShowGrid = useStore((s) => s.setShowGrid)
  const showAxes = useStore((s) => s.showAxes)
  const setShowAxes = useStore((s) => s.setShowAxes)
  const backgroundColor = useStore((s) => s.backgroundColor)
  const setBackgroundColor = useStore((s) => s.setBackgroundColor)

  const handleAddObject = () => {
    const obj: SceneObject = {
      id: uid(),
      name: `${addType.charAt(0).toUpperCase() + addType.slice(1)}`,
      type: addType as GeometryType,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      material: { ...defaultMaterial },
      castShadow: true,
      receiveShadow: false,
      animationType: 'none',
      animationSpeed: 0.3,
    }
    addObject(obj)
    selectObject(obj.id)
  }

  const handleAddModel = (model: typeof bundledModels[0]) => {
    const obj: SceneObject = {
      id: uid(),
      name: model.name,
      type: 'model',
      modelUrl: model.file,
      position: [0, model.yOffset, 0],
      rotation: [0, 0, 0],
      scale: model.scale,
      visible: true,
      material: { ...defaultMaterial },
      castShadow: true,
      receiveShadow: true,
      animationType: 'none',
      animationSpeed: 0.3,
    }
    addObject(obj)
    selectObject(obj.id)
  }

  return (
    <div className="flex flex-col gap-1">
      <Section title="Scene Presets">
        <div className="grid grid-cols-1 gap-1">
          {Object.entries(scenePresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="text-left px-2.5 py-2 rounded-lg bg-zinc-800/50 border border-zinc-800
                hover:border-zinc-600 hover:bg-zinc-800 transition-all text-xs group"
            >
              <span className="text-zinc-200 font-medium group-hover:text-white">{preset.name}</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">{preset.description}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Scene Settings">
        <Toggle label="Grid" value={showGrid} onChange={setShowGrid} />
        <Toggle label="Axes Helper" value={showAxes} onChange={setShowAxes} />
        <ColorInput label="Background" value={backgroundColor} onChange={setBackgroundColor} />
      </Section>

      <Section title="Add Primitive">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <Select
              label=""
              value={addType}
              options={geometryOptions}
              onChange={setAddType}
            />
          </div>
          <button
            onClick={handleAddObject}
            className="p-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors shrink-0 mt-auto"
            title="Add Object"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </Section>

      <Section title="Bundled Models">
        <div className="grid grid-cols-1 gap-1">
          {bundledModels.map((model) => (
            <button
              key={model.file}
              onClick={() => handleAddModel(model)}
              className="flex items-center gap-2 text-left px-2.5 py-2 rounded-lg bg-zinc-800/50
                border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all
                text-xs text-zinc-300 hover:text-white"
            >
              <Package className="w-3.5 h-3.5 text-accent shrink-0" />
              {model.name}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 mt-1">
          Drag & drop .glb/.gltf files onto the viewport to import custom models
        </p>
      </Section>

      <Section title="Scene Hierarchy">
        <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto">
          {objects.length === 0 && (
            <p className="text-[10px] text-zinc-600 py-2 text-center">No objects in scene</p>
          )}
          {objects.map((obj) => (
            <div
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all text-xs
                ${
                  selectedObjectId === obj.id
                    ? 'bg-accent/10 border border-accent/30 text-zinc-100'
                    : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
            >
              {obj.type === 'model' ? (
                <Package className="w-3 h-3 shrink-0 text-accent" />
              ) : (
                <Layers className="w-3 h-3 shrink-0" />
              )}
              <span className="flex-1 truncate">{obj.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  updateObject(obj.id, { visible: !obj.visible })
                }}
                className="p-0.5 hover:text-zinc-100 transition-colors"
              >
                {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateObject(obj.id)
                }}
                className="p-0.5 hover:text-zinc-100 transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeObject(obj.id)
                }}
                className="p-0.5 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

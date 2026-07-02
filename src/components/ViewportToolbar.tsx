import { useState } from 'react'
import {
  Move,
  RotateCw,
  Maximize,
  Plus,
  Box,
  Circle,
  Triangle,
  Hexagon,
  Diamond,
  Cylinder,
  Cone,
  Donut,
  X,
} from 'lucide-react'
import { useStore } from '../store'
import { defaultMaterial } from '../materials'
import type { SceneObject, GeometryType, TransformMode } from '../types'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const shapes: { type: GeometryType; label: string; icon: typeof Box }[] = [
  { type: 'box', label: 'Box', icon: Box },
  { type: 'sphere', label: 'Sphere', icon: Circle },
  { type: 'cylinder', label: 'Cylinder', icon: Cylinder },
  { type: 'cone', label: 'Cone', icon: Cone },
  { type: 'torus', label: 'Torus', icon: Donut },
  { type: 'torusKnot', label: 'Torus Knot', icon: Donut },
  { type: 'icosahedron', label: 'Icosahedron', icon: Hexagon },
  { type: 'dodecahedron', label: 'Dodecahedron', icon: Hexagon },
  { type: 'octahedron', label: 'Octahedron', icon: Diamond },
  { type: 'capsule', label: 'Capsule', icon: Circle },
]

const transformTools: { mode: TransformMode; label: string; icon: typeof Move; key: string }[] = [
  { mode: 'translate', label: 'Move (W)', icon: Move, key: 'W' },
  { mode: 'rotate', label: 'Rotate (E)', icon: RotateCw, key: 'E' },
  { mode: 'scale', label: 'Scale (R)', icon: Maximize, key: 'R' },
]

export function ViewportToolbar() {
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false)
  const transformMode = useStore((s) => s.transformMode)
  const setTransformMode = useStore((s) => s.setTransformMode)
  const selectedObjectId = useStore((s) => s.selectedObjectId)
  const addObject = useStore((s) => s.addObject)
  const selectObject = useStore((s) => s.selectObject)

  const handleAddShape = (type: GeometryType) => {
    const obj: SceneObject = {
      id: uid(),
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      material: { ...defaultMaterial, color: '#a78bfa', metalness: 0.2, roughness: 0.4 },
      castShadow: true,
      receiveShadow: false,
      animationType: 'none',
      animationSpeed: 0.3,
    }
    addObject(obj)
    selectObject(obj.id)
    setShapeMenuOpen(false)
  }

  return (
    <>
      {/* Transform Mode Toolbar - top left */}
      <div className="absolute top-3 left-3 flex gap-1 z-10">
        {transformTools.map((tool) => {
          const Icon = tool.icon
          const isActive = transformMode === tool.mode
          return (
            <button
              key={tool.mode}
              onClick={() => setTransformMode(tool.mode)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all
                ${
                  isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'bg-surface-900/90 backdrop-blur-sm text-zinc-400 hover:text-white hover:bg-surface-800/90 border border-white/[0.06]'
                }`}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}

        <div className="w-px bg-zinc-700 mx-0.5" />

        {/* Add Shape Button */}
        <div className="relative">
          <button
            onClick={() => setShapeMenuOpen(!shapeMenuOpen)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all
              ${
                shapeMenuOpen
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'bg-surface-900/90 backdrop-blur-sm text-zinc-400 hover:text-white hover:bg-surface-800/90 border border-white/[0.06]'
              }`}
            title="Add Shape"
          >
            {shapeMenuOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          {shapeMenuOpen && (
            <div className="absolute top-full left-0 mt-2 bg-surface-900/95 backdrop-blur-md
              border border-white/[0.08] rounded-xl p-2 shadow-2xl shadow-black/50 min-w-[200px] z-20">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider px-2 py-1">
                Add Shape
              </p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {shapes.map((shape) => {
                  const Icon = shape.icon
                  return (
                    <button
                      key={shape.type}
                      onClick={() => handleAddShape(shape.type)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-300
                        hover:text-white hover:bg-accent/15 transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-accent" />
                      {shape.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected object indicator */}
      {selectedObjectId && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-surface-900/90 backdrop-blur-sm border border-accent/30 rounded-lg
            px-3 py-1.5 text-xs text-accent flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Object selected — use W/E/R to switch transform mode
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint - bottom left */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none select-none z-10">
        <div className="text-[10px] font-mono text-zinc-600/70 flex flex-col gap-0.5">
          <span>W move · E rotate · R scale · G grid</span>
          <span>Space play/pause · P panel · F fullscreen</span>
          <span>⌘D duplicate · Del remove · Drop GLB to import</span>
        </div>
      </div>
    </>
  )
}

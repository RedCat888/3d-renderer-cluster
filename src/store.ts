import { create } from 'zustand'
import type {
  SceneObject,
  LightConfig,
  MaterialConfig,
  ToneMappingType,
  EnvironmentPreset,
  PanelTab,
  TransformMode,
} from './types'
import { defaultMaterial, applyPreset } from './materials'
import { scenePresets } from './presets'

interface AppState {
  objects: SceneObject[]
  selectedObjectId: string | null
  lights: LightConfig[]
  selectedLightId: string | null

  showGrid: boolean
  showAxes: boolean
  backgroundColor: string

  ambientIntensity: number
  ambientColor: string
  environmentPreset: EnvironmentPreset
  environmentIntensity: number
  environmentBackground: boolean
  shadowsEnabled: boolean

  cameraFov: number
  cameraNear: number
  cameraFar: number
  autoRotate: boolean
  autoRotateSpeed: number
  cameraPreset: string

  toneMapping: ToneMappingType
  exposure: number
  bloomEnabled: boolean
  bloomIntensity: number
  bloomThreshold: number
  ssaoEnabled: boolean
  vignetteEnabled: boolean
  fxaaEnabled: boolean
  pixelRatio: number

  animationPlaying: boolean
  animationSpeed: number
  turntableEnabled: boolean
  turntableSpeed: number

  exportWidth: number
  exportHeight: number
  exportFormat: 'png' | 'jpg' | 'webp'
  exportTransparent: boolean
  exportPixelRatio: number

  transformMode: TransformMode
  activePanel: PanelTab
  panelOpen: boolean
  fullscreen: boolean

  undoStack: string[]
  canUndo: boolean

  setTransformMode: (m: TransformMode) => void
  selectObject: (id: string | null) => void
  selectLight: (id: string | null) => void
  updateObject: (id: string, updates: Partial<SceneObject>) => void
  updateObjectMaterial: (id: string, updates: Partial<MaterialConfig>) => void
  applyMaterialPreset: (id: string, preset: string) => void
  addObject: (obj: SceneObject) => void
  removeObject: (id: string) => void
  duplicateObject: (id: string) => void

  updateLight: (id: string, updates: Partial<LightConfig>) => void
  addLight: (light: LightConfig) => void
  removeLight: (id: string) => void

  setShowGrid: (v: boolean) => void
  setShowAxes: (v: boolean) => void
  setBackgroundColor: (c: string) => void
  setAmbientIntensity: (v: number) => void
  setAmbientColor: (c: string) => void
  setEnvironmentPreset: (p: EnvironmentPreset) => void
  setEnvironmentIntensity: (v: number) => void
  setEnvironmentBackground: (v: boolean) => void
  setShadowsEnabled: (v: boolean) => void

  setCameraFov: (v: number) => void
  setCameraNear: (v: number) => void
  setCameraFar: (v: number) => void
  setAutoRotate: (v: boolean) => void
  setAutoRotateSpeed: (v: number) => void
  setCameraPreset: (p: string) => void

  setToneMapping: (t: ToneMappingType) => void
  setExposure: (v: number) => void
  setBloomEnabled: (v: boolean) => void
  setBloomIntensity: (v: number) => void
  setBloomThreshold: (v: number) => void
  setSsaoEnabled: (v: boolean) => void
  setVignetteEnabled: (v: boolean) => void
  setFxaaEnabled: (v: boolean) => void
  setPixelRatio: (v: number) => void

  setAnimationPlaying: (v: boolean) => void
  setAnimationSpeed: (v: number) => void
  setTurntableEnabled: (v: boolean) => void
  setTurntableSpeed: (v: number) => void

  setExportWidth: (v: number) => void
  setExportHeight: (v: number) => void
  setExportFormat: (f: 'png' | 'jpg' | 'webp') => void
  setExportTransparent: (v: boolean) => void
  setExportPixelRatio: (v: number) => void

  setActivePanel: (p: PanelTab) => void
  setPanelOpen: (v: boolean) => void
  setFullscreen: (v: boolean) => void

  loadPreset: (presetName: string) => void
  resetScene: () => void
  exportSceneJSON: () => string
  importSceneJSON: (json: string) => void
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

const defaultPreset = scenePresets.studioProduct

export const useStore = create<AppState>((set, get) => ({
  objects: defaultPreset.objects,
  selectedObjectId: null,
  lights: defaultPreset.lights,
  selectedLightId: null,

  showGrid: true,
  showAxes: false,
  backgroundColor: defaultPreset.backgroundColor,

  ambientIntensity: defaultPreset.ambientIntensity,
  ambientColor: defaultPreset.ambientColor,
  environmentPreset: defaultPreset.environmentPreset,
  environmentIntensity: defaultPreset.environmentIntensity,
  environmentBackground: false,
  shadowsEnabled: true,

  cameraFov: 45,
  cameraNear: 0.1,
  cameraFar: 1000,
  autoRotate: false,
  autoRotateSpeed: 1,
  cameraPreset: 'default',

  toneMapping: defaultPreset.toneMapping,
  exposure: defaultPreset.exposure,
  bloomEnabled: defaultPreset.bloomEnabled,
  bloomIntensity: defaultPreset.bloomIntensity,
  bloomThreshold: defaultPreset.bloomThreshold,
  ssaoEnabled: true,
  vignetteEnabled: false,
  fxaaEnabled: true,
  pixelRatio: Math.min(window.devicePixelRatio, 2),

  animationPlaying: true,
  animationSpeed: 1,
  turntableEnabled: false,
  turntableSpeed: 1,

  exportWidth: 1920,
  exportHeight: 1080,
  exportFormat: 'png',
  exportTransparent: false,
  exportPixelRatio: 2,

  transformMode: 'translate' as TransformMode,
  activePanel: 'scene',
  panelOpen: true,
  fullscreen: false,

  undoStack: [],
  canUndo: false,

  setTransformMode: (m) => set({ transformMode: m }),
  selectObject: (id) => set({ selectedObjectId: id }),
  selectLight: (id) => set({ selectedLightId: id }),

  updateObject: (id, updates) =>
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  updateObjectMaterial: (id, updates) =>
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, material: { ...o.material, ...updates } } : o
      ),
    })),

  applyMaterialPreset: (id, preset) =>
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, material: applyPreset(preset) } : o
      ),
    })),

  addObject: (obj) => set((s) => ({ objects: [...s.objects, obj] })),

  removeObject: (id) =>
    set((s) => ({
      objects: s.objects.filter((o) => o.id !== id),
      selectedObjectId: s.selectedObjectId === id ? null : s.selectedObjectId,
    })),

  duplicateObject: (id) =>
    set((s) => {
      const src = s.objects.find((o) => o.id === id)
      if (!src) return s
      const dup: SceneObject = {
        ...src,
        id: uid(),
        name: src.name + ' Copy',
        position: [src.position[0] + 1, src.position[1], src.position[2]],
        material: { ...src.material },
      }
      return { objects: [...s.objects, dup] }
    }),

  updateLight: (id, updates) =>
    set((s) => ({
      lights: s.lights.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  addLight: (light) => set((s) => ({ lights: [...s.lights, light] })),

  removeLight: (id) =>
    set((s) => ({
      lights: s.lights.filter((l) => l.id !== id),
      selectedLightId: s.selectedLightId === id ? null : s.selectedLightId,
    })),

  setShowGrid: (v) => set({ showGrid: v }),
  setShowAxes: (v) => set({ showAxes: v }),
  setBackgroundColor: (c) => set({ backgroundColor: c }),
  setAmbientIntensity: (v) => set({ ambientIntensity: v }),
  setAmbientColor: (c) => set({ ambientColor: c }),
  setEnvironmentPreset: (p) => set({ environmentPreset: p as EnvironmentPreset }),
  setEnvironmentIntensity: (v) => set({ environmentIntensity: v }),
  setEnvironmentBackground: (v) => set({ environmentBackground: v }),
  setShadowsEnabled: (v) => set({ shadowsEnabled: v }),

  setCameraFov: (v) => set({ cameraFov: v }),
  setCameraNear: (v) => set({ cameraNear: v }),
  setCameraFar: (v) => set({ cameraFar: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setAutoRotateSpeed: (v) => set({ autoRotateSpeed: v }),
  setCameraPreset: (p) => set({ cameraPreset: p }),

  setToneMapping: (t) => set({ toneMapping: t }),
  setExposure: (v) => set({ exposure: v }),
  setBloomEnabled: (v) => set({ bloomEnabled: v }),
  setBloomIntensity: (v) => set({ bloomIntensity: v }),
  setBloomThreshold: (v) => set({ bloomThreshold: v }),
  setSsaoEnabled: (v) => set({ ssaoEnabled: v }),
  setVignetteEnabled: (v) => set({ vignetteEnabled: v }),
  setFxaaEnabled: (v) => set({ fxaaEnabled: v }),
  setPixelRatio: (v) => set({ pixelRatio: v }),

  setAnimationPlaying: (v) => set({ animationPlaying: v }),
  setAnimationSpeed: (v) => set({ animationSpeed: v }),
  setTurntableEnabled: (v) => set({ turntableEnabled: v }),
  setTurntableSpeed: (v) => set({ turntableSpeed: v }),

  setExportWidth: (v) => set({ exportWidth: v }),
  setExportHeight: (v) => set({ exportHeight: v }),
  setExportFormat: (f) => set({ exportFormat: f }),
  setExportTransparent: (v) => set({ exportTransparent: v }),
  setExportPixelRatio: (v) => set({ exportPixelRatio: v }),

  setActivePanel: (p) => set({ activePanel: p }),
  setPanelOpen: (v) => set({ panelOpen: v }),
  setFullscreen: (v) => set({ fullscreen: v }),

  loadPreset: (presetName) => {
    const preset = scenePresets[presetName as keyof typeof scenePresets]
    if (!preset) return
    set({
      objects: preset.objects.map((o) => ({ ...o, id: uid(), material: { ...o.material } })),
      lights: preset.lights.map((l) => ({ ...l, id: uid() })),
      ambientIntensity: preset.ambientIntensity,
      ambientColor: preset.ambientColor,
      backgroundColor: preset.backgroundColor,
      environmentPreset: preset.environmentPreset,
      environmentIntensity: preset.environmentIntensity,
      exposure: preset.exposure,
      toneMapping: preset.toneMapping,
      bloomEnabled: preset.bloomEnabled,
      bloomIntensity: preset.bloomIntensity,
      bloomThreshold: preset.bloomThreshold,
      selectedObjectId: null,
      selectedLightId: null,
    })
  },

  resetScene: () => {
    get().loadPreset('studioProduct')
  },

  exportSceneJSON: () => {
    const s = get()
    return JSON.stringify(
      {
        objects: s.objects,
        lights: s.lights,
        ambientIntensity: s.ambientIntensity,
        ambientColor: s.ambientColor,
        backgroundColor: s.backgroundColor,
        environmentPreset: s.environmentPreset,
        environmentIntensity: s.environmentIntensity,
        exposure: s.exposure,
        toneMapping: s.toneMapping,
        bloomEnabled: s.bloomEnabled,
        bloomIntensity: s.bloomIntensity,
        bloomThreshold: s.bloomThreshold,
        cameraFov: s.cameraFov,
      },
      null,
      2
    )
  },

  importSceneJSON: (json) => {
    try {
      const data = JSON.parse(json)
      set({
        objects: data.objects ?? [],
        lights: data.lights ?? [],
        ambientIntensity: data.ambientIntensity ?? 0.3,
        ambientColor: data.ambientColor ?? '#ffffff',
        backgroundColor: data.backgroundColor ?? '#09090b',
        environmentPreset: data.environmentPreset ?? 'studio',
        environmentIntensity: data.environmentIntensity ?? 0.8,
        exposure: data.exposure ?? 1,
        toneMapping: data.toneMapping ?? 'ACESFilmic',
        bloomEnabled: data.bloomEnabled ?? false,
        bloomIntensity: data.bloomIntensity ?? 0.5,
        bloomThreshold: data.bloomThreshold ?? 0.8,
        selectedObjectId: null,
        selectedLightId: null,
      })
    } catch {
      console.error('Failed to import scene JSON')
    }
  },
}))

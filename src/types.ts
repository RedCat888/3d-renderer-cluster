export type GeometryType =
  | 'torusKnot'
  | 'sphere'
  | 'box'
  | 'icosahedron'
  | 'dodecahedron'
  | 'cylinder'
  | 'cone'
  | 'torus'
  | 'octahedron'
  | 'capsule'
  | 'ring'
  | 'model'

export interface MaterialConfig {
  preset: string
  color: string
  metalness: number
  roughness: number
  emissive: string
  emissiveIntensity: number
  opacity: number
  transparent: boolean
  wireframe: boolean
  transmission: number
  ior: number
  thickness: number
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
}

export interface SceneObject {
  id: string
  name: string
  type: GeometryType
  modelUrl?: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
  material: MaterialConfig
  castShadow: boolean
  receiveShadow: boolean
  animationType: 'none' | 'rotate' | 'float' | 'pulse'
  animationSpeed: number
  geometryArgs?: number[]
}

export interface LightConfig {
  id: string
  name: string
  type: 'directional' | 'point' | 'spot'
  position: [number, number, number]
  color: string
  intensity: number
  castShadow: boolean
  visible: boolean
  angle?: number
  penumbra?: number
  distance?: number
  decay?: number
  target?: [number, number, number]
}

export type ToneMappingType =
  | 'ACESFilmic'
  | 'Reinhard'
  | 'Cineon'
  | 'Linear'
  | 'AgX'
  | 'Neutral'

export type EnvironmentPreset =
  | 'studio'
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'city'
  | 'park'
  | 'lobby'

export type ScenePresetName =
  | 'studioProduct'
  | 'sciFiNeon'
  | 'architecturalMinimal'
  | 'sunsetOutdoor'
  | 'darkCinematic'

export interface ScenePreset {
  name: string
  description: string
  objects: SceneObject[]
  lights: LightConfig[]
  ambientIntensity: number
  ambientColor: string
  backgroundColor: string
  environmentPreset: EnvironmentPreset
  environmentIntensity: number
  exposure: number
  toneMapping: ToneMappingType
  bloomEnabled: boolean
  bloomIntensity: number
  bloomThreshold: number
}

export type PanelTab =
  | 'scene'
  | 'camera'
  | 'lighting'
  | 'material'
  | 'render'
  | 'export'

export type TransformMode = 'translate' | 'rotate' | 'scale'

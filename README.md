# Studio 3D — Local Rendering Engine

A premium, fully local 3D rendering studio built with React Three Fiber. Runs entirely on your Mac with bundled models, beautiful scene presets, full lighting/material/camera controls, postprocessing, and high-res export.

![Stack](https://img.shields.io/badge/React-TypeScript-blue) ![Stack](https://img.shields.io/badge/Three.js-R3F-green) ![Stack](https://img.shields.io/badge/Vite-Tailwind-purple)

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The default scene renders immediately with studio lighting, animated procedural geometry, and postprocessing.

## Features

### Scene System
- **5 curated scene presets**: Studio Product, Sci-Fi Neon, Architectural Minimal, Sunset Outdoor, Dark Cinematic
- **5 bundled GLB models**: Damaged Helmet, Duck, Toy Car, Avocado, Sheen Chair (Khronos samples)
- **10 procedural primitives**: Torus Knot, Sphere, Box, Icosahedron, Dodecahedron, Cylinder, Cone, Torus, Octahedron, Capsule
- **Drag-and-drop** GLB/GLTF import for custom models
- Object hierarchy with visibility, duplicate, delete controls
- Per-object position, rotation, scale editing

### Camera
- Orbit controls with damping
- 8 camera presets (Default 3/4, Front, Top, Side, Close Up, Wide, Low Angle, Dramatic)
- FOV, near/far clipping controls
- Auto-rotate mode
- Turntable mode for product renders

### Lighting
- Ambient, Directional, Point, and Spot lights
- Per-light color, intensity, position, shadow controls
- Spot light angle/penumbra controls
- Point light distance/decay controls
- 10 HDRI environment presets (Studio, Sunset, Dawn, Night, Warehouse, Forest, Apartment, City, Park, Lobby)
- Environment intensity control
- Optional environment as background
- Shadow toggle

### Materials
- **11 material presets**: Matte Clay, Brushed Metal, Chrome, Glass, Plastic, Neon Emissive, Gold, Frosted Translucent, Obsidian, Copper, Pearl
- Full PBR control: color, metalness, roughness, emissive, opacity, wireframe
- Advanced: transmission, IOR, thickness, clearcoat, clearcoat roughness, env map intensity
- Quick-apply to selected object

### Postprocessing
- Bloom with intensity/threshold controls
- SSAO (ambient occlusion)
- Vignette
- SMAA anti-aliasing
- Tone mapping: ACES Filmic, Reinhard, Cineon, Linear, AgX, Neutral
- Exposure control
- Pixel ratio control for performance vs quality

### Animation
- Per-object animation: Rotate, Float, Pulse
- Global play/pause and speed control
- Per-object animation speed

### Export
- High-res screenshot capture (PNG, JPG, WebP)
- Resolution presets: HD, FHD, 2K, 4K, Square, Portrait
- Custom resolution
- Configurable DPR for export
- Transparent background option
- Scene export/import as JSON

### UI / UX
- Dark premium UI with zinc/indigo color palette
- Tabbed control panel: Scene, Camera, Lights, Material, Render, Export
- Collapsible sections within each panel
- Keyboard shortcuts for all major actions
- Axis gizmo (bottom-left corner)
- Grid and axes helpers
- Fullscreen mode
- Toggle panel visibility
- Responsive layout

## Controls

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `G` | Toggle grid |
| `A` | Toggle axes |
| `R` | Toggle auto-rotate |
| `Space` | Play/pause animations |
| `P` | Toggle control panel |
| `F` | Toggle fullscreen |
| `Escape` | Deselect object/light |
| `Delete` | Remove selected object |
| `⌘D` / `Ctrl+D` | Duplicate selected |
| `1`–`6` | Switch panel tabs |

### Mouse
- **Left drag**: Orbit camera
- **Right drag**: Pan camera
- **Scroll**: Zoom
- **Click object**: Select it
- **Click empty**: Deselect

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| 3D Engine | Three.js r175 via React Three Fiber |
| 3D Helpers | Drei (OrbitControls, Environment, Grid, ContactShadows, GizmoHelper, useGLTF) |
| Postprocessing | @react-three/postprocessing (Bloom, SSAO, Vignette, SMAA) |
| State | Zustand |
| Build | Vite |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |

## Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build (tsc + vite build)
npm run preview   # Preview production build
npm run typecheck # TypeScript type checking
```

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root layout
├── index.css                   # Tailwind + global styles
├── types.ts                    # TypeScript interfaces
├── store.ts                    # Zustand state management
├── materials.ts                # Material preset definitions
├── presets.ts                  # Scene preset definitions
├── components/
│   ├── Viewport.tsx            # Canvas + postprocessing
│   ├── Scene.tsx               # Environment, ground, objects, grid
│   ├── SceneObject.tsx         # Individual object renderer (procedural + GLB)
│   ├── Lights.tsx              # Dynamic light system
│   ├── CameraRig.tsx           # Camera controls + presets
│   ├── Header.tsx              # Top toolbar
│   ├── ControlPanel.tsx        # Tabbed panel container
│   ├── panels/
│   │   ├── ScenePanel.tsx      # Scene presets, hierarchy, add objects
│   │   ├── CameraPanel.tsx     # Camera settings
│   │   ├── LightingPanel.tsx   # Light management
│   │   ├── MaterialPanel.tsx   # Material editor
│   │   ├── RenderPanel.tsx     # Postprocessing + animation
│   │   └── ExportPanel.tsx     # Screenshot + scene I/O
│   └── ui/
│       └── Controls.tsx        # Reusable UI primitives
├── hooks/
│   ├── useKeyboard.ts          # Keyboard shortcuts
│   └── useDragDrop.ts          # GLB drag-and-drop import
public/
└── models/                     # Bundled GLB models
    ├── DamagedHelmet.glb
    ├── Duck.glb
    ├── ToyCar.glb
    ├── Avocado.glb
    └── SheenChair.glb
```

## Bundled Assets

All models are from the [Khronos glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) repository, freely distributable for testing and demonstration.

| Model | Size | Notes |
|-------|------|-------|
| Damaged Helmet | 3.6 MB | Sci-fi helmet with detailed PBR textures |
| Duck | 118 KB | Classic test model |
| Toy Car | 5.2 MB | Detailed vehicle with multiple materials |
| Avocado | 7.7 MB | Food product with subsurface-like textures |
| Sheen Chair | 3.9 MB | Furniture with sheen material |

## Importing Custom Models

- **Drag and drop**: Drop any `.glb` or `.gltf` file onto the viewport
- **Scene panel**: Bundled models can be added from the "Bundled Models" section

## Scene Presets

1. **Studio Product** — Clean white studio lighting, chrome/glass/gold objects, subtle bloom
2. **Sci-Fi Neon** — Dark scene with neon emissive objects, heavy bloom, colored lighting
3. **Architectural Minimal** — Soft neutral lighting, matte clay materials, clean composition
4. **Sunset Outdoor** — Warm golden-hour directional light, copper/pearl materials
5. **Dark Cinematic** — Dramatic hard lighting, deep shadows, moody atmosphere

## Known Limitations

- Three.js r175 deprecation warnings for Clock and PCFSoftShadowMap (library-level, non-breaking)
- SSAO may have slight visual artifacts on transparent/transmissive materials
- GLB models use their own baked materials; the material editor only affects procedural objects
- Screenshot captures the current viewport resolution; for higher res, increase DPR before capture
- No real-time GI; lighting is approximated via environment maps + direct lights

## Suggested Enhancements

- Transform gizmo (translate/rotate/scale handles) via drei TransformControls
- GLTF animation playback with mixer integration
- Node-based material editor
- Render queue for batch exports from multiple camera presets
- Electron/Tauri wrapper for native desktop experience
- Screen-space reflections via postprocessing
- Light probe grid for more accurate indirect lighting
- Timeline-based camera animation with keyframes
- Undo/redo via Zustand middleware
- Local autosave of scene state

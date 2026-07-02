import {
  Layers,
  Camera,
  Sun,
  Palette,
  Sparkles,
  Download,
} from 'lucide-react'
import { useStore } from '../store'
import type { PanelTab } from '../types'
import { ScenePanel } from './panels/ScenePanel'
import { CameraPanel } from './panels/CameraPanel'
import { LightingPanel } from './panels/LightingPanel'
import { MaterialPanel } from './panels/MaterialPanel'
import { RenderPanel } from './panels/RenderPanel'
import { ExportPanel } from './panels/ExportPanel'

const tabs: { id: PanelTab; label: string; icon: typeof Layers }[] = [
  { id: 'scene', label: 'Scene', icon: Layers },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'lighting', label: 'Lights', icon: Sun },
  { id: 'material', label: 'Material', icon: Palette },
  { id: 'render', label: 'Render', icon: Sparkles },
  { id: 'export', label: 'Export', icon: Download },
]

function PanelContent({ tab }: { tab: PanelTab }) {
  switch (tab) {
    case 'scene':
      return <ScenePanel />
    case 'camera':
      return <CameraPanel />
    case 'lighting':
      return <LightingPanel />
    case 'material':
      return <MaterialPanel />
    case 'render':
      return <RenderPanel />
    case 'export':
      return <ExportPanel />
    default:
      return null
  }
}

export function ControlPanel() {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const panelOpen = useStore((s) => s.panelOpen)

  if (!panelOpen) return null

  return (
    <div className="w-[320px] h-full bg-surface-900 border-l border-white/[0.06] flex flex-col shrink-0">
      <div className="flex border-b border-white/[0.06] shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activePanel === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-all text-[10px]
                border-b-2 ${
                  isActive
                    ? 'border-accent text-accent bg-accent/[0.04]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                }`}
              title={tab.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin">
        <PanelContent tab={activePanel} />
      </div>
    </div>
  )
}

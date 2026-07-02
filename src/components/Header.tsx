import {
  Box,
  Maximize2,
  Minimize2,
  RotateCcw,
  PanelRightOpen,
  PanelRightClose,
  Download,
  Upload,
} from 'lucide-react'
import { useStore } from '../store'

export function Header() {
  const panelOpen = useStore((s) => s.panelOpen)
  const setPanelOpen = useStore((s) => s.setPanelOpen)
  const fullscreen = useStore((s) => s.fullscreen)
  const setFullscreen = useStore((s) => s.setFullscreen)
  const resetScene = useStore((s) => s.resetScene)
  const exportSceneJSON = useStore((s) => s.exportSceneJSON)
  const importSceneJSON = useStore((s) => s.importSceneJSON)

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const handleExportJSON = () => {
    const json = exportSceneJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scene.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      importSceneJSON(text)
    }
    input.click()
  }

  return (
    <header className="h-11 bg-surface-900 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Studio 3D
          </span>
        </div>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-[11px] text-zinc-500 font-mono">v1.0</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleImportJSON}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Import Scene (JSON)"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleExportJSON}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Export Scene (JSON)"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetScene}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Reset Scene"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-zinc-800 mx-1" />

        <button
          onClick={handleFullscreen}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Fullscreen"
        >
          {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Toggle Panel"
        >
          {panelOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  )
}

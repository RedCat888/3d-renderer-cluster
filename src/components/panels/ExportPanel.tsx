import { Camera, Image, FileJson, FolderOpen } from 'lucide-react'
import { useStore } from '../../store'
import { Section, Slider, Select, Toggle, NumberInput, Button } from '../ui/Controls'

export function ExportPanel() {
  const exportWidth = useStore((s) => s.exportWidth)
  const setExportWidth = useStore((s) => s.setExportWidth)
  const exportHeight = useStore((s) => s.exportHeight)
  const setExportHeight = useStore((s) => s.setExportHeight)
  const exportFormat = useStore((s) => s.exportFormat)
  const setExportFormat = useStore((s) => s.setExportFormat)
  const exportTransparent = useStore((s) => s.exportTransparent)
  const setExportTransparent = useStore((s) => s.setExportTransparent)
  const exportPixelRatio = useStore((s) => s.exportPixelRatio)
  const setExportPixelRatio = useStore((s) => s.setExportPixelRatio)
  const exportSceneJSON = useStore((s) => s.exportSceneJSON)
  const importSceneJSON = useStore((s) => s.importSceneJSON)

  const handleScreenshot = () => {
    const canvas = document.getElementById('render-canvas') as HTMLCanvasElement | null
    if (!canvas) {
      const canvasEl = document.querySelector('canvas')
      if (!canvasEl) return
      doExport(canvasEl)
      return
    }
    doExport(canvas)
  }

  const doExport = (canvas: HTMLCanvasElement) => {
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      webp: 'image/webp',
    }

    const link = document.createElement('a')
    link.download = `render_${Date.now()}.${exportFormat}`
    link.href = canvas.toDataURL(mimeTypes[exportFormat], 0.95)
    link.click()
  }

  const handleExportJSON = () => {
    const json = exportSceneJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scene_${Date.now()}.json`
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

  const resolutionPresets = [
    { label: 'HD', w: 1280, h: 720 },
    { label: 'FHD', w: 1920, h: 1080 },
    { label: '2K', w: 2560, h: 1440 },
    { label: '4K', w: 3840, h: 2160 },
    { label: 'Square', w: 2048, h: 2048 },
    { label: 'Portrait', w: 1080, h: 1920 },
  ]

  return (
    <div className="flex flex-col gap-1">
      <Section title="Image Export">
        <div className="grid grid-cols-3 gap-1 mb-1">
          {resolutionPresets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setExportWidth(p.w)
                setExportHeight(p.h)
              }}
              className={`px-2 py-1 rounded-md text-[10px] transition-all
                ${
                  exportWidth === p.w && exportHeight === p.h
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <NumberInput
          label="Width"
          value={exportWidth}
          min={100}
          max={7680}
          step={10}
          onChange={setExportWidth}
          suffix="px"
        />
        <NumberInput
          label="Height"
          value={exportHeight}
          min={100}
          max={4320}
          step={10}
          onChange={setExportHeight}
          suffix="px"
        />
        <Select
          label="Format"
          value={exportFormat}
          options={[
            { value: 'png', label: 'PNG' },
            { value: 'jpg', label: 'JPG' },
            { value: 'webp', label: 'WebP' },
          ]}
          onChange={(v) => setExportFormat(v as any)}
        />
        <Slider
          label="Export DPR"
          value={exportPixelRatio}
          min={1}
          max={4}
          step={0.5}
          onChange={setExportPixelRatio}
          suffix="x"
        />
        <Toggle label="Transparent BG" value={exportTransparent} onChange={setExportTransparent} />

        <Button onClick={handleScreenshot} variant="primary" size="md" className="w-full mt-1">
          <Camera className="w-4 h-4" /> Capture Screenshot
        </Button>
      </Section>

      <Section title="Scene Data">
        <Button onClick={handleExportJSON} variant="secondary" className="w-full">
          <FileJson className="w-3.5 h-3.5" /> Export Scene JSON
        </Button>
        <Button onClick={handleImportJSON} variant="secondary" className="w-full">
          <FolderOpen className="w-3.5 h-3.5" /> Import Scene JSON
        </Button>
      </Section>
    </div>
  )
}

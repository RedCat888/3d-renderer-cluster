import { useEffect } from 'react'
import { useStore } from '../store'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return

      const store = useStore.getState()

      switch (e.key.toLowerCase()) {
        case 'w':
          if (!e.metaKey && !e.ctrlKey) {
            store.setTransformMode('translate')
          }
          break
        case 'e':
          if (!e.metaKey && !e.ctrlKey) {
            store.setTransformMode('rotate')
          }
          break
        case 'g':
          store.setShowGrid(!store.showGrid)
          break
        case 'a':
          if (!e.metaKey && !e.ctrlKey) {
            store.setShowAxes(!store.showAxes)
          }
          break
        case ' ':
          e.preventDefault()
          store.setAnimationPlaying(!store.animationPlaying)
          break
        case 'escape':
          store.selectObject(null)
          store.selectLight(null)
          break
        case 'delete':
        case 'backspace':
          if (store.selectedObjectId) {
            store.removeObject(store.selectedObjectId)
          }
          break
        case 'd':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            if (store.selectedObjectId) {
              store.duplicateObject(store.selectedObjectId)
            }
          }
          break
        case 'p':
          if (!e.metaKey && !e.ctrlKey) {
            store.setPanelOpen(!store.panelOpen)
          }
          break
        case 'f':
          if (!e.metaKey && !e.ctrlKey) {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen()
              store.setFullscreen(true)
            } else {
              document.exitFullscreen()
              store.setFullscreen(false)
            }
          }
          break
        case '1':
          store.setActivePanel('scene')
          break
        case '2':
          store.setActivePanel('camera')
          break
        case '3':
          store.setActivePanel('lighting')
          break
        case '4':
          store.setActivePanel('material')
          break
        case '5':
          store.setActivePanel('render')
          break
        case '6':
          store.setActivePanel('export')
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}

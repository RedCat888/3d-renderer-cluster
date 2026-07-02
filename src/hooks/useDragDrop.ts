import { useEffect, useCallback } from 'react'
import { useStore } from '../store'
import { defaultMaterial } from '../materials'
import type { SceneObject } from '../types'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function useDragDrop() {
  const addObject = useStore((s) => s.addObject)
  const selectObject = useStore((s) => s.selectObject)

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files
      if (!files) return

      Array.from(files).forEach((file) => {
        if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
          const url = URL.createObjectURL(file)
          const obj: SceneObject = {
            id: uid(),
            name: file.name.replace(/\.(glb|gltf)$/, ''),
            type: 'model',
            modelUrl: url,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            visible: true,
            material: { ...defaultMaterial },
            castShadow: true,
            receiveShadow: true,
            animationType: 'none',
            animationSpeed: 0,
          }
          addObject(obj)
          selectObject(obj.id)
        }
      })
    },
    [addObject, selectObject]
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  useEffect(() => {
    window.addEventListener('drop', handleDrop)
    window.addEventListener('dragover', handleDragOver)
    return () => {
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('dragover', handleDragOver)
    }
  }, [handleDrop, handleDragOver])
}

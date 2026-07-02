import { Header } from './components/Header'
import { Viewport } from './components/Viewport'
import { ControlPanel } from './components/ControlPanel'
import { useKeyboardShortcuts } from './hooks/useKeyboard'
import { useDragDrop } from './hooks/useDragDrop'

export default function App() {
  useKeyboardShortcuts()
  useDragDrop()

  return (
    <div className="w-full h-full flex flex-col bg-surface-950">
      <Header />
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 relative">
          <Viewport />
        </div>
        <ControlPanel />
      </div>
    </div>
  )
}

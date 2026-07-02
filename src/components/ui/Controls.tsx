import { useCallback, type ReactNode } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}

export function Slider({ label, value, min, max, step = 0.01, onChange, suffix }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs font-mono text-zinc-500">
          {typeof value === 'number' ? value.toFixed(step >= 1 ? 0 : 2) : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-125"
      />
    </div>
  )
}

interface ColorInputProps {
  label: string
  value: string
  onChange: (c: string) => void
}

export function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-500">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent
            [&::-webkit-color-swatch-wrapper]:p-0
            [&::-webkit-color-swatch]:rounded
            [&::-webkit-color-swatch]:border-0"
        />
      </div>
    </div>
  )
}

interface ToggleProps {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-colors relative ${
          value ? 'bg-accent' : 'bg-zinc-700'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-200
          focus:outline-none focus:border-accent cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}

export function NumberInput({ label, value, min, max, step = 1, onChange, suffix }: NumberInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value)
      if (!isNaN(v)) onChange(v)
    },
    [onChange]
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          className="w-16 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200
            text-right font-mono focus:outline-none focus:border-accent"
        />
        {suffix && <span className="text-xs text-zinc-500">{suffix}</span>}
      </div>
    </div>
  )
}

interface Vec3InputProps {
  label: string
  value: [number, number, number]
  onChange: (v: [number, number, number]) => void
  step?: number
}

export function Vec3Input({ label, value, onChange, step = 0.1 }: Vec3InputProps) {
  const labels = ['X', 'Y', 'Z']
  const colors = ['text-red-400', 'text-green-400', 'text-blue-400']

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-0.5 flex-1">
            <span className={`text-[10px] font-mono ${colors[i]}`}>{labels[i]}</span>
            <input
              type="number"
              value={value[i]}
              step={step}
              onChange={(e) => {
                const newVal = [...value] as [number, number, number]
                newVal[i] = parseFloat(e.target.value) || 0
                onChange(newVal)
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-[11px]
                text-zinc-200 text-right font-mono focus:outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Section({ title, children, defaultOpen = true }: SectionProps) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex items-center gap-2 cursor-pointer select-none py-1.5 px-1
        text-xs font-medium text-zinc-300 hover:text-zinc-100 transition-colors
        [&::-webkit-details-marker]:hidden list-none">
        <svg
          className="w-3 h-3 text-zinc-500 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </summary>
      <div className="flex flex-col gap-2.5 pl-1 pr-0.5 pb-2 pt-1">
        {children}
      </div>
    </details>
  )
}

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function Button({ children, onClick, variant = 'secondary', size = 'sm', className = '' }: ButtonProps) {
  const base = 'rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-1.5'
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
  }
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  }

  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

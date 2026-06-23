'use client'

import { useState } from 'react'

interface OptionChipsProps {
  options: string[]
  selected?: string
  onSelect: (option: string) => void
  editable?: boolean
}

function Checkmark() {
  return (
    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function OptionChips({ options, selected, onSelect, editable = false }: OptionChipsProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])

  function toggle(opt: string) {
    setLocalSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    )
  }

  // Already answered — editable: allow changing
  if (selected && editable) {
    return (
      <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
        <p className="text-[10px] text-muted-foreground/40 mb-0.5">Tap to change answer</p>
        {options.map((opt) => {
          const isChosen = opt === selected
          return (
            <button
              key={opt}
              onClick={() => !isChosen && onSelect(opt)}
              disabled={isChosen}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border text-left transition-all duration-150
                ${isChosen
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-700 cursor-default'
                  : 'bg-card/40 text-muted-foreground/50 border-border/30 hover:bg-indigo-950/30 hover:border-indigo-700/60 hover:text-indigo-300/80 active:scale-[0.98]'
                }
              `}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${isChosen ? 'bg-indigo-600 border-indigo-600' : 'border-border/30'}`}>
                {isChosen && <Checkmark />}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    )
  }

  // Already answered — read-only display
  if (selected) {
    const selectedArr = selected.split(', ')
    return (
      <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
        {options.map((opt) => {
          const isChosen = selectedArr.includes(opt)
          return (
            <div
              key={opt}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-none
                ${isChosen
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-700'
                  : 'bg-muted/20 text-muted-foreground/30 border-border/20'
                }
              `}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${isChosen ? 'bg-indigo-600 border-indigo-600' : 'border-border/30'}`}>
                {isChosen && <Checkmark />}
              </span>
              {opt}
            </div>
          )
        })}
      </div>
    )
  }

  // Unanswered — interactive
  return (
    <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
      {options.map((opt) => {
        const isChosen = localSelected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border text-left transition-all duration-150 active:scale-[0.98]
              ${isChosen
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-700 shadow-sm shadow-indigo-900/20'
                : 'bg-card text-muted-foreground border-border hover:bg-indigo-950/30 hover:border-indigo-700 hover:text-indigo-300'
              }
            `}
          >
            <span className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${isChosen ? 'bg-indigo-600 border-indigo-600' : 'border-border'}`}>
              {isChosen && <Checkmark />}
            </span>
            {opt}
          </button>
        )
      })}

      {localSelected.length > 0 && (
        <button
          onClick={() => onSelect(localSelected.join(', '))}
          className="mt-1 self-start flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all duration-150 shadow-sm shadow-indigo-900/40"
        >
          Confirm
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      )}
    </div>
  )
}

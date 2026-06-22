interface OptionChipsProps {
  options: string[]
  selected?: string
  onSelect: (option: string) => void
}

export default function OptionChips({ options, selected, onSelect }: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((opt) => {
        const isSelected = selected === opt
        const isDisabled = !!selected
        return (
          <button
            key={opt}
            disabled={isDisabled}
            onClick={() => onSelect(opt)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
              ${isSelected
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-900/40'
                : isDisabled
                  ? 'bg-muted/40 text-muted-foreground/30 border-border/30 cursor-not-allowed'
                  : 'bg-card text-indigo-400 border-border hover:bg-indigo-950/50 hover:border-indigo-600 hover:text-indigo-300 cursor-pointer active:scale-95'
              }
            `}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

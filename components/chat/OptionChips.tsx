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
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                : isDisabled
                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                  : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-sm cursor-pointer active:scale-95'
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

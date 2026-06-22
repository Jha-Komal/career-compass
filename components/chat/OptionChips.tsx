import { Button } from '@/components/ui/button'

interface OptionChipsProps {
  options: string[]
  selected?: string
  onSelect: (option: string) => void
}

export default function OptionChips({ options, selected, onSelect }: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <Button
          key={opt}
          variant={selected === opt ? 'default' : 'outline'}
          size="sm"
          disabled={!!selected}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  )
}

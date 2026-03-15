import { LAYOUT_NAMES } from '../layoutPresets';

interface Props {
  current: number;
  onChange: (index: number) => void;
}

export function LayoutPagination({ current, onChange }: Props) {
  const total = LAYOUT_NAMES.length;

  return (
    <div className="flex items-center justify-center gap-3 py-6 px-4 select-none">
      <button
        onClick={() => onChange(Math.max(0, current - 1))}
        disabled={current === 0}
        className="text-[var(--color-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity text-xs font-mono px-1"
      >
        ◄
      </button>

      <div className="flex gap-1 flex-wrap justify-center max-w-2xl">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`
              w-7 h-7 text-xs font-mono border transition-all
              ${i === current
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(total - 1, current + 1))}
        disabled={current === total - 1}
        className="text-[var(--color-primary)] opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity text-xs font-mono px-1"
      >
        ►
      </button>

      <span className="text-[var(--color-text-dim)] text-xs font-mono ml-2 opacity-60">
        {LAYOUT_NAMES[current]}
      </span>
    </div>
  );
}

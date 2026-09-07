"use client";

interface VariantOption {
  id: string;
  value: string;
  stock: number;
}

export function VariantSelector({
  type,
  options,
  selectedId,
  onSelect,
}: {
  type: string;
  options: VariantOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-wide text-ink">{type}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={type}>
        {options.map((option) => {
          const outOfStock = option.stock <= 0;
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={outOfStock}
              onClick={() => onSelect(option.id)}
              title={outOfStock ? `${option.value} — out of stock` : option.value}
              className={`focus-ring relative min-w-11 border px-3.5 py-2.5 text-sm transition-colors ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : outOfStock
                    ? "border-line text-muted/50 line-through"
                    : "border-line text-ink hover:border-ink"
              }`}
            >
              {option.value}
              {outOfStock && !selected ? (
                <span className="sr-only"> (out of stock)</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

"use client";

export function QuantitySelector({
  quantity,
  max,
  onChange,
  disabled = false,
}: {
  quantity: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  const clampedMax = Math.max(1, max);

  function set(next: number) {
    onChange(Math.min(clampedMax, Math.max(1, next)));
  }

  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={() => set(quantity - 1)}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
        className="focus-ring flex h-11 w-11 items-center justify-center text-ink disabled:opacity-30"
      >
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={quantity}
        min={1}
        max={clampedMax}
        disabled={disabled}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) set(next);
        }}
        aria-label="Quantity"
        className="focus-ring h-11 w-12 border-x border-line text-center text-sm text-ink [appearance:textfield] disabled:opacity-30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(quantity + 1)}
        disabled={disabled || quantity >= clampedMax}
        aria-label="Increase quantity"
        className="focus-ring flex h-11 w-11 items-center justify-center text-ink disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

"use client";

// Large labelled number field for the Assumptions panel.
export function NumField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step,
  min = 0,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
        {label}
      </span>
      <div className="flex items-center gap-1 rounded-2xl border border-line bg-canvas/60 px-4 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25">
        {prefix && <span className="text-lg text-mute" aria-hidden>{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : min}
          step={step}
          min={min}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
          className="w-full min-w-0 bg-transparent text-2xl font-medium tabular-nums text-ink outline-none placeholder:text-mute/40"
        />
        {suffix && <span className="text-sm font-medium text-mute" aria-hidden>{suffix}</span>}
      </div>
      {hint && <span className="mt-1.5 block text-xs text-mute/80">{hint}</span>}
    </label>
  );
}

// Compact inline dollar input used inside the lump-sums table.
export function MiniNum({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-canvas/60 px-2.5 py-1 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25">
      <span className="text-mute">$</span>
      <input
        type="number"
        value={value || ""}
        placeholder="0"
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-24 bg-transparent text-right text-sm tabular-nums text-ink outline-none placeholder:text-mute/50"
      />
    </div>
  );
}

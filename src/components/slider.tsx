"use client";

export function Slider({ label, value, min, max, step = 1, onChange, display, minLabel, maxLabel }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
  display: string; minLabel?: string; maxLabel?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between text-sm"><span className="font-medium">{label}</span><span className="font-semibold text-brand">{display}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-brand" />
      {(minLabel || maxLabel) && <span className="flex justify-between text-[11px] text-neutral-400"><span>{minLabel}</span><span>{maxLabel}</span></span>}
    </label>
  );
}

"use client";

interface SliderInputProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  formatLabel?: (val: number) => string;
  minLabel?: string;
  maxLabel?: string;
  trackColor?: string;
}

export default function SliderInput({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel,
  minLabel,
  maxLabel,
  trackColor,
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative mb-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: trackColor
              ? `linear-gradient(to right, ${trackColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`
              : `linear-gradient(to right, #C68A2B ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between">
          {minLabel && (
            <span className="text-xs text-[#A1A1AA]">{minLabel}</span>
          )}
          {maxLabel && (
            <span className="text-xs text-[#A1A1AA]">{maxLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

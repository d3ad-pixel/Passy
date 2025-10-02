import { useEffect, useId, useState } from "react";

type SliderProps = {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  showValue?: boolean;
};

export default function Slider({
  label,
  value,
  min = 1,
  max = 128,
  step = 1,
  onChange,
  className,
  showValue = true,
}: SliderProps) {
  const id = useId();
  const [textValue, setTextValue] = useState<string>(String(value));

  useEffect(() => {
    setTextValue(String(value));
  }, [value]);

  return (
    <div className={"flex flex-col gap-1 " + (className ?? "") }>
      {label && (
        <label htmlFor={id} className="flex items-center gap-2 text-sm">
          <span>{label}</span>
          {showValue && (
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={textValue}
              onChange={(e) => setTextValue(e.currentTarget.value)}
              onBlur={() => {
                const parsed = parseInt(textValue, 10);
                if (Number.isNaN(parsed)) {
                  setTextValue(String(value));
                  return;
                }
                const clamped = Math.min(max, Math.max(min, parsed));
                if (clamped !== value) onChange(clamped);
                setTextValue(String(clamped));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.currentTarget as HTMLInputElement).blur();
                }
              }}
              className="ml-1 w-16 text-center rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-800 bg-white"
            />
          )}
        </label>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.currentTarget.value))}
        className="w-full cursor-pointer appearance-none bg-transparent slider focus:outline-none"
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}



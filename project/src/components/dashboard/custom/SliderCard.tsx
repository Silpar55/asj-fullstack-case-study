"use client";

interface Props {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}

export const SliderCard = ({
  label,
  sublabel,
  value,
  onChange,
  color,
}: Props) => {
  const accent = color.includes("green") ? "#10b981" : "#dc2626";

  const handleInput = (raw: string) => {
    const n = Math.min(200, Math.max(0, Number(raw) || 0));
    onChange(n);
  };

  return (
    <div className="flex-1 bg-nav rounded-xl p-5 border border-gray-700 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
          {label}
        </p>
        <div className="flex items-baseline gap-0.5">
          <input
            type="number"
            min={0}
            max={200}
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            className={`text-2xl font-bold w-15 text-right bg-transparent focus:outline-none ${color}`}
          />
          <span className={`text-lg font-bold ${color}`}>%</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={200}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>0%</span>
        <span className="text-gray-500">{sublabel}</span>
        <span>200%</span>
      </div>
    </div>
  );
};


import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '%' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="w-full mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center space-x-4">
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <span className="text-sm font-semibold text-gray-800 w-16 text-right">{value.toFixed(1)}{unit}</span>
      </div>
    </div>
  );
};

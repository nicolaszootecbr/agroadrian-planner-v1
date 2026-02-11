
import React from 'react';

interface InputProps {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export const Input: React.FC<InputProps> = ({ label, value, unit, onChange, step = 1, min = 0, max = 100000 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="w-full mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="number"
          id={label}
          name={label}
          value={String(value)}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-12 focus:border-green-500 focus:ring-green-500 sm:text-sm"
          aria-label={label}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

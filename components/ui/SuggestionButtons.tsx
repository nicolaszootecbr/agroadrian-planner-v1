
import React from 'react';

interface SuggestionOption {
    label: string;
    value: number;
}

interface SuggestionButtonsProps {
  label: string;
  options: SuggestionOption[];
  currentValue: number;
  onChange: (value: number) => void;
}

export const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ label, options, currentValue, onChange }) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}: <span className="font-bold text-green-700">{currentValue}%</span></label>
      <div className="flex items-center space-x-2">
        {options.map(option => (
            <button
                key={option.label}
                onClick={() => onChange(option.value)}
                type="button"
                className={`px-4 py-1 text-sm rounded-full transition-colors ${
                    currentValue === option.value
                        ? 'bg-green-600 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {option.label}
            </button>
        ))}
      </div>
    </div>
  );
};

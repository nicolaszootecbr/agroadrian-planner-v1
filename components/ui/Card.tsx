
import React from 'react';
import { Icon, IconName } from './Icon';

interface CardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: IconName;
  color?: string;
  extraInfo?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, unit, icon, color = 'bg-green-600', extraInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-start space-x-4">
      <div className={`p-3 rounded-full ${color} text-white`}>
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">
          {typeof value === 'number' ? value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : value}
          <span className="text-lg font-medium text-gray-600 ml-1">{unit}</span>
        </p>
        {extraInfo && <p className="text-xs text-gray-400 mt-1">{extraInfo}</p>}
      </div>
    </div>
  );
};
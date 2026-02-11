
import React from 'react';
import { Module } from '../../types';
import { Icon } from '../ui/Icon';

interface BottomNavProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
}

const navItems = [
  { module: Module.Dashboard, label: 'Painel', icon: 'home' as const },
  { module: Module.Animal, label: 'Animal', icon: 'cow' as const },
  { module: Module.Terra, label: 'Terra', icon: 'tractor' as const },
  { module: Module.Silo, label: 'Silo', icon: 'silo' as const },
  { module: Module.Pasto, label: 'Pasto', icon: 'grass' as const },
  { module: Module.Custo, label: 'Custos', icon: 'money' as const },
  { module: Module.Report, label: 'Laudo', icon: 'document' as const },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeModule, setActiveModule }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] flex justify-around items-center py-2 z-20 no-print">
      {navItems.map(({ module, label, icon }) => (
        <button
          key={module}
          onClick={() => setActiveModule(module)}
          className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
            activeModule === module ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
          }`}
          aria-label={label}
        >
          <Icon name={icon} className="w-6 h-6" />
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
};
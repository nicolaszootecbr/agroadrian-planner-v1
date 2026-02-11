
import React from 'react';
import { Module } from '../../types';
import { Icon } from '../ui/Icon';

interface SidebarProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
}

const navItems = [
  { module: Module.Dashboard, label: 'Dashboard', icon: 'home' as const },
  { module: Module.Animal, label: 'Animal', icon: 'cow' as const },
  { module: Module.Terra, label: 'Terra', icon: 'tractor' as const },
  { module: Module.Silo, label: 'Silo', icon: 'silo' as const },
  { module: Module.Pasto, label: 'Pasto', icon: 'grass' as const },
  { module: Module.Custo, label: 'Custos', icon: 'money' as const },
  { module: Module.Report, label: 'Relatório', icon: 'document' as const },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg no-print">
      <div className="flex items-center justify-center h-16 bg-green-700 text-white">
        <h2 className="text-2xl font-bold tracking-wider">AgroAdrian</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(({ module, label, icon }) => (
          <button
            key={module}
            onClick={() => setActiveModule(module)}
            className={`flex items-center w-full px-4 py-2 text-base rounded-lg transition-colors duration-200 ${
              activeModule === module 
                ? 'bg-green-600 text-white font-semibold shadow-md' 
                : 'text-gray-600 hover:bg-green-100 hover:text-green-800'
            }`}
          >
            <Icon name={icon} className="w-6 h-6 mr-3" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
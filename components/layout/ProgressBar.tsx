
import React from 'react';
import { Module } from '../../types';

interface ProgressBarProps {
    currentModule: Module;
}

const modulesOrder = [Module.Dashboard, Module.Animal, Module.Terra, Module.Silo, Module.Pasto, Module.Custo, Module.Report];
const moduleLabels: Record<Module, string> = {
    [Module.Dashboard]: 'Diagnóstico',
    [Module.Animal]: 'Animal',
    [Module.Terra]: 'Terra',
    [Module.Silo]: 'Silo',
    [Module.Pasto]: 'Pasto',
    [Module.Custo]: 'Custos',
    [Module.Report]: 'Relatório',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentModule }) => {
    const currentIndex = modulesOrder.indexOf(currentModule);

    return (
        <div>
            <div className="flex justify-between mb-1">
                {modulesOrder.map((module, index) => (
                    <span key={module} className={`text-sm font-medium ${index <= currentIndex ? 'text-green-700' : 'text-gray-400'}`}>
                        {moduleLabels[module]}
                    </span>
                ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${((currentIndex) / (modulesOrder.length - 1)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};
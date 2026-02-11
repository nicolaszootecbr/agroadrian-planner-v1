
import React from 'react';
import { Icon } from '../ui/Icon';

interface PlanningModeSelectorProps {
    onSelectMode: (mode: 'basic' | 'advanced') => void;
}

export const PlanningModeSelector: React.FC<PlanningModeSelectorProps> = ({ onSelectMode }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Bem-vindo ao AgroAdrian Planner</h1>
                <p className="mt-2 text-lg text-gray-600">Como deseja realizar o planejamento?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                <button
                    onClick={() => onSelectMode('basic')}
                    className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-start"
                >
                    <div className="p-3 rounded-full bg-green-100 text-green-700 mb-4">
                        <Icon name="cow" className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Lote Único (Simples)</h2>
                    <p className="mt-2 text-gray-600">Ideal para rebanhos homogêneos ou para um planejamento rápido com base em médias.</p>
                </button>
                <button
                    onClick={() => onSelectMode('advanced')}
                    className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-start"
                >
                     <div className="p-3 rounded-full bg-blue-100 text-blue-700 mb-4">
                        <Icon name="silo" className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Múltiplas Categorias (Avançado)</h2>
                    <p className="mt-2 text-gray-600">Para rebanhos mistos. Detalhe a demanda por categorias como vacas, novilhas e bezerros.</p>
                </button>
            </div>
        </div>
    );
};
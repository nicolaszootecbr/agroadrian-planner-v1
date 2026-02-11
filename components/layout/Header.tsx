
import React from 'react';
import { Icon } from '../ui/Icon';

interface HeaderProps {
    onSave: () => void;
    onExport: () => void;
    onPrint: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSave, onExport, onPrint, onReset }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10 no-print">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-green-800">AgroAdrian Planner</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onReset}
                        aria-label="Novo Planejamento"
                        className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <Icon name="reset" className="h-5 w-5 mr-1" />
                        Novo Planejamento
                    </button>
                    <button 
                        onClick={onSave}
                        aria-label="Salvar Cenário"
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <Icon name="download" className="h-6 w-6" />
                    </button>
                     <button 
                        onClick={onPrint}
                        aria-label="Imprimir Laudo Técnico"
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                       <Icon name="printer" className="h-6 w-6" />
                    </button>
                    <button 
                        onClick={onExport}
                        aria-label="Exportar para WhatsApp"
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};
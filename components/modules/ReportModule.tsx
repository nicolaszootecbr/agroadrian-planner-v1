
import React from 'react';
import { CalculatedResults, MotorZootecniaData } from '../../types';
import { Icon } from '../ui/Icon';
import { LaudoTecnico } from '../layout/LaudoTecnico';

interface ReportModuleProps {
  results: CalculatedResults;
  inputs: MotorZootecniaData;
  onGenerateReport: () => void;
  onPrint: () => void;
}

export const ReportModule: React.FC<ReportModuleProps> = ({ results, inputs, onGenerateReport, onPrint }) => {
  const hasAnimals = inputs.siloMode === 'basic' 
    ? inputs.numero_de_animais > 0
    : inputs.animalCategories.some(c => c.count > 0);
  
  const hasForages = inputs.forages.some(f => f.areaHa > 0);
  const canGenerateReport = hasAnimals && hasForages && results.is_valid;

  const disabledButtonClasses = "bg-gray-400 cursor-not-allowed";
  const enabledPrintClasses = "bg-blue-600 hover:bg-blue-700";
  const enabledTxtClasses = "bg-green-600 hover:bg-green-700";
  const baseButtonClasses = "flex items-center px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Central de Relatórios</h2>
        <div className="flex items-center space-x-4">
            <button
                onClick={onGenerateReport}
                disabled={!canGenerateReport}
                title={!canGenerateReport ? "Adicione animais e lavouras com área para gerar o relatório." : "Exportar Memória de Cálculo"}
                className={`${baseButtonClasses} ${canGenerateReport ? enabledTxtClasses : disabledButtonClasses} focus:ring-green-500`}
            >
                <Icon name="document" className="w-5 h-5 mr-2" />
                Exportar Memória de Cálculo (TXT)
            </button>
            <button
                onClick={onPrint}
                disabled={!canGenerateReport}
                title={!canGenerateReport ? "Adicione animais e lavouras com área para gerar o laudo." : "Baixar Laudo Técnico"}
                className={`${baseButtonClasses} ${canGenerateReport ? enabledPrintClasses : disabledButtonClasses} focus:ring-blue-500`}
            >
                <Icon name="download" className="w-5 h-5 mr-2" />
                Baixar Laudo Técnico (PDF)
            </button>
        </div>
      </div>
      <p className="text-gray-600">Utilize os botões acima para exportar seus dados. A pré-visualização abaixo mostra como o Laudo Técnico será impresso.</p>

      {/* Preview Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-2 text-gray-700">Pré-visualização do Laudo Técnico</h3>
        <div className="p-8 bg-gray-200 rounded-lg">
            <div className="bg-white shadow-2xl max-w-5xl mx-auto">
                {canGenerateReport ? (
                    <LaudoTecnico results={results} inputs={inputs} />
                ) : (
                    <div className="text-center py-20">
                        <h4 className="text-lg font-semibold text-gray-700">Relatório Indisponível</h4>
                        <p className="text-gray-500 mt-2">Por favor, adicione pelo menos um lote de animais e uma lavoura com área definida para visualizar o laudo.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
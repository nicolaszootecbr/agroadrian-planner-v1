
import React from 'react';
import { MotorZootecniaData, CalculatedResults } from '../../types';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { SuggestionButtons } from '../ui/SuggestionButtons';
import { InfoTooltip } from '../ui/InfoTooltip';

interface TerraModuleProps {
  inputs: MotorZootecniaData;
  results: CalculatedResults;
  onInputChange: (field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => void;
}

export const TerraModule: React.FC<TerraModuleProps> = ({ inputs, results, onInputChange }) => {
  
  const estoqueStatusColor = results.estoque_deficit_superavit_ha >= 0 ? 'bg-blue-600' : 'bg-red-500';
  const estoqueStatusText = results.estoque_deficit_superavit_ha >= 0 ? 'Superávit' : 'Déficit';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Módulo Terra: Perdas e Balanço</h2>
      
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-2">Balanço de Áreas (calculado)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Área Total de Silagem</p>
                <p className="text-xl font-bold text-gray-800">{results.debug_total_silage_area_ha.toFixed(2)} ha</p>
             </div>
             <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Área Total de Pasto</p>
                <p className="text-xl font-bold text-gray-800">{results.debug_total_pasture_area_ha.toFixed(2)} ha</p>
             </div>
        </div>
        <Input 
          label="Aproveitamento da Rebrota (Soca)"
          value={inputs.rebrota_percent}
          onChange={(val) => onInputChange('rebrota_percent', val)}
          unit="%"
        />
      </div>

      <div className="p-4 bg-white rounded-xl shadow-md">
         <div className="flex items-center mb-4">
            <h3 className="font-semibold text-lg">Estimativa de Perdas (%)</h3>
            <InfoTooltip text="Selecione um nível de perda ou ajuste os valores para refletir sua operação. As perdas impactam diretamente a quantidade de comida que chega no cocho." />
        </div>
        <SuggestionButtons 
            label="Perdas (Colheita e Transporte)"
            options={[{label: 'Baixo', value: 3}, {label: 'Médio', value: 6}, {label: 'Alto', value: 9}]}
            currentValue={inputs.perdas_colheita_transporte}
            onChange={(val) => onInputChange('perdas_colheita_transporte', val)}
        />
        <SuggestionButtons 
            label="Perdas (Armazenamento no Silo)"
            options={[{label: 'Baixo', value: 10}, {label: 'Médio', value: 14}, {label: 'Alto', value: 18}]}
            currentValue={inputs.perdas_armazenamento}
            onChange={(val) => onInputChange('perdas_armazenamento', val)}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Balanço da Área de Silagem</h3>
        <Card 
            title={estoqueStatusText}
            value={Math.abs(results.estoque_deficit_superavit_ha).toFixed(2)}
            unit="hectares"
            icon="area"
            color={estoqueStatusColor}
            extraInfo={`Hectares de Roça para Plantar: ${results.area_necessaria_final_ha.toFixed(2)} ha`}
        />
      </div>
    </div>
  );
};
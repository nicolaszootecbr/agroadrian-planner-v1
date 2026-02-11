
import React from 'react';
import { MotorZootecniaData, ForageData } from '../../types';
import { Input } from '../ui/Input';
import { InfoTooltip } from '../ui/InfoTooltip';

interface CustoModuleProps {
  inputs: MotorZootecniaData;
  onInputChange: (field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => void;
  onForageInputChange: (id: number, field: keyof Omit<ForageData, 'id' | 'name'>, value: number | string) => void;
}

export const CustoModule: React.FC<CustoModuleProps> = ({ inputs, onInputChange, onForageInputChange }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Módulo Custos: Análise Financeira</h2>

      <div className="p-4 bg-white rounded-xl shadow-md">
        <div className="flex items-center mb-2">
            <h3 className="font-semibold text-lg">Custos Gerais</h3>
            <InfoTooltip text="Insira os custos gerais da sua operação para um cálculo financeiro preciso." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                label="Custo de Ensilagem"
                value={inputs.custo_ensilagem_ha}
                onChange={(val) => onInputChange('custo_ensilagem_ha', val)}
                unit="R$/ha"
                step={50}
            />
            <Input 
                label="Custo do Concentrado"
                value={inputs.custo_concentrado_kg_ms}
                onChange={(val) => onInputChange('custo_concentrado_kg_ms', val)}
                unit="R$/kg MS"
                step={0.05}
            />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Custos de Produção por Lavoura</h3>
        <div className="space-y-4">
            {inputs.forages.map(forage => (
                <div key={forage.id} className="p-4 bg-white rounded-xl shadow-md flex items-center justify-between">
                    <div>
                        <p className="font-bold text-green-700">{forage.name}</p>
                        <p className="text-sm text-gray-500">Uso: {forage.uso}</p>
                    </div>
                    <div className="w-1/2">
                         <Input 
                            label="Custo de Produção"
                            value={forage.costPerHectare}
                            onChange={(val) => onForageInputChange(forage.id, 'costPerHectare', val)}
                            unit="R$/ha"
                            step={100}
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
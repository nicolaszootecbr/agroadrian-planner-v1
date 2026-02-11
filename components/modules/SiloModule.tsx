
import React from 'react';
import { MotorZootecniaData, CalculatedResults } from '../../types';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import { SiloVisualizer } from '../ui/SiloVisualizer';

interface SiloModuleProps {
  inputs: MotorZootecniaData;
  results: CalculatedResults;
  onInputChange: (field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => void;
}

export const SiloModule: React.FC<SiloModuleProps> = ({ inputs, results, onInputChange }) => {
  
  const siloStatusColor = results.silo_status_divisao === 'ADEQUADO' ? 'bg-green-600' : 'bg-yellow-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Módulo Silo: O Cofre de Comida</h2>
      
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-2">Parâmetros da Silagem</h3>
        <Input 
          label="Duração da Seca (Trato no Cocho)"
          value={inputs.periodo_de_consumo_da_silagem}
          onChange={(val) => onInputChange('periodo_de_consumo_da_silagem', val)}
          unit="dias"
        />
        <Slider
          label="Qualidade da Silagem (% Matéria Seca)"
          value={inputs.teor_de_ms_da_silagem}
          onChange={(val) => onInputChange('teor_de_ms_da_silagem', val)}
          min={20} max={50} step={0.5}
        />
        <Input
            label="Peso da Silagem Compactada"
            value={inputs.densidade_silagem_kg_m3}
            onChange={(val) => onInputChange('densidade_silagem_kg_m3', val)}
            unit="kg/m³" step={10}
         />
      </div>

       <div className="p-4 bg-white rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-2">Tamanho do Silo e Resultados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <Input label="Altura da Parede (h)" value={inputs.silo_altura} onChange={(val) => onInputChange('silo_altura', val)} unit="m" step={0.1}/>
                <Input label="Largura de Cima (B)" value={inputs.silo_largura_topo} onChange={(val) => onInputChange('silo_largura_topo', val)} unit="m" step={0.5} />
                <Input label="Fatia Diária Mínima" value={inputs.fatia_retirada_minima_m} onChange={(val) => onInputChange('fatia_retirada_minima_m', val)} unit="m/dia" step={0.05} max={1}/>
            </div>
            <div className="flex flex-col items-center justify-center">
                <SiloVisualizer altura={inputs.silo_altura} larguraTopo={inputs.silo_largura_topo} larguraFundo={results.silo_largura_fundo_m} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
             <Card title="Manejo do Painel" value={results.silo_status_divisao} unit="" icon="silo" color={siloStatusColor} />
             <Card title="Comprimento Necessário (C)" value={results.silo_comprimento_m.toFixed(1)} unit="m" icon="ruler" />
        </div>
      </div>

    </div>
  );
};

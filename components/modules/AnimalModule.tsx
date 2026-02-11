
import React from 'react';
import { MotorZootecniaData, AnimalCategory } from '../../types';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { InfoTooltip } from '../ui/InfoTooltip';
import { travas } from '../../data/catalogo';
import { Icon } from '../ui/Icon';

interface AnimalModuleProps {
  inputs: MotorZootecniaData;
  onInputChange: (field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => void;
  onCategoryChange: (id: number, field: keyof Omit<AnimalCategory, 'id' | 'name'>, value: number) => void;
  addAnimalCategory: () => void;
  removeAnimalCategory: (id: number) => void;
}

const ConsumptionInput: React.FC<{
    label: string,
    value: number,
    onChange: (value: number) => void
}> = ({ label, value, onChange }) => {
    const warning = value > travas.alerta_metabolico && value <= travas.consumo_max;
    const error = value > travas.consumo_max;
    
    return (
        <div>
            <Input label={label} value={value} onChange={onChange} unit="%" step={0.1}/>
            {warning && <p className="text-sm text-orange-600 -mt-2">Risco Metabólico/Consumo Elevado.</p>}
            {error && <p className="text-sm text-red-600 font-bold -mt-2">ERRO: Consumo acima do limite biológico ({travas.consumo_max}%).</p>}
        </div>
    );
};

const DietBalancer: React.FC<{
    volumoso: number,
    onVolumosoChange: (value: number) => void
}> = ({ volumoso, onVolumosoChange }) => {
    const concentrado = 100 - volumoso;

    const handleVolumosoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(0, Math.min(100, Number(e.target.value)));
        onVolumosoChange(val);
    };

    const handleConcentradoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(0, Math.min(100, Number(e.target.value)));
        onVolumosoChange(100 - val);
    };

    return (
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Volumoso (% Dieta)</label>
                <input type="number" value={volumoso} onChange={handleVolumosoChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Concentrado (% Dieta)</label>
                <input type="number" value={concentrado} onChange={handleConcentradoChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"/>
             </div>
        </div>
    )
}

export const AnimalModule: React.FC<AnimalModuleProps> = ({ inputs, onInputChange, onCategoryChange, addAnimalCategory, removeAnimalCategory }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Módulo Animal: A Fome do Rebanho</h2>
      
      <div className="p-4 bg-white rounded-xl shadow-md">
        <div className="flex items-center mb-4">
            <h3 className="font-semibold text-lg">Balanço da Dieta (Cocho)</h3>
            <InfoTooltip text="Defina a composição da dieta na seca. Isso impactará diretamente a quantidade de silagem necessária." />
        </div>
        
        <DietBalancer volumoso={inputs.relacao_volumoso_concentrado} onVolumosoChange={(val) => onInputChange('relacao_volumoso_concentrado', val)} />

        <div className="mt-4">
            <Slider
                label="Matéria Seca do Concentrado"
                value={inputs.teor_ms_concentrado}
                onChange={(val) => onInputChange('teor_ms_concentrado', val)}
                min={80} max={95} step={0.5}
            />
        </div>
        <Slider
            label="Sobra de Comida no Cocho"
            value={inputs.sobras_de_cocho_geral}
            onChange={(val) => onInputChange('sobras_de_cocho_geral', val)}
            min={0} max={15} step={1}
        />
      </div>
      
      {inputs.siloMode === 'advanced' ? (
          <div className="p-4 bg-white rounded-xl shadow-md animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Detalhar Lotes do Rebanho</h3>
                <button onClick={addAnimalCategory} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Adicionar Lote</button>
              </div>
              
              {inputs.animalCategories.length > 0 ? (
                  inputs.animalCategories.map(cat => (
                      <div key={cat.id} className="mb-4 p-3 border rounded-lg relative">
                           <button onClick={() => removeAnimalCategory(cat.id)} className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200" aria-label="Remover Lote">
                                <Icon name="trash" className="w-4 h-4" />
                           </button>
                          <p className="font-bold text-green-700">{cat.name}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <Input label="Nº de animais" value={cat.count} onChange={val => onCategoryChange(cat.id, 'count', val)} unit="cab." />
                              <Input label="Peso Médio" value={cat.weight} onChange={val => onCategoryChange(cat.id, 'weight', val)} unit="kg" />
                              <ConsumptionInput label="Consumo (% do Peso)" value={cat.msConsumptionPercent} onChange={val => onCategoryChange(cat.id, 'msConsumptionPercent', val)} />
                          </div>
                      </div>
                  ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                    <p className="text-gray-500">Nenhum lote adicionado.</p>
                    <p className="text-sm text-gray-400">Clique em "Adicionar Lote" para configurar seu rebanho.</p>
                </div>
              )}
          </div>
      ) : (
        <div className="p-4 bg-white rounded-xl shadow-md animate-fade-in">
            <h3 className="font-semibold text-lg mb-2">Dados do Lote Único</h3>
            <Input 
            label="Número de Animais"
            value={inputs.numero_de_animais}
            onChange={(val) => onInputChange('numero_de_animais', val)}
            unit="cabeças"
            step={1}
            />
            <Input 
            label="Peso Médio do Lote"
            value={inputs.peso_medio_categoria_kg}
            onChange={(val) => onInputChange('peso_medio_categoria_kg', val)}
            unit="kg"
            step={5}
            />
            <ConsumptionInput
                label="Quanto o animal come (% do Peso)"
                value={inputs.consumo_de_ms_por_pv_do_animal}
                onChange={(val) => onInputChange('consumo_de_ms_por_pv_do_animal', val)}
            />
        </div>
      )}

    </div>
  );
};
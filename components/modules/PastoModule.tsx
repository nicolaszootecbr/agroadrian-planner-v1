
import React from 'react';
import { MotorZootecniaData, CalculatedResults, ForageData } from '../../types';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { InfoTooltip } from '../ui/InfoTooltip';
import { catalogoDeCulturas } from '../../data/catalogo';
import { Icon } from '../ui/Icon';

interface PastoModuleProps {
  inputs: MotorZootecniaData;
  results: CalculatedResults;
  onInputChange: (field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => void;
  onForageInputChange: (id: number, field: keyof Omit<ForageData, 'id'>, value: number | string) => void;
  addForage: () => void;
  removeForage: (id: number) => void;
}

const ForageCard: React.FC<{
    forage: ForageData, 
    onForageInputChange: (id: number, field: keyof Omit<ForageData, 'id'>, value: number | string) => void,
    onRemove: (id: number) => void;
}> = ({ forage, onForageInputChange, onRemove }) => {
    
    let productionLabel = 'Produção';
    let productionUnit = 'kg/ha';
    let productionStep = 1;

    switch(forage.uso) {
        case 'Silagem':
            productionLabel = 'Prod. Massa Verde';
            productionUnit = 'kg/ha';
            productionStep = 1000;
            break;
        case 'Pasto':
            productionLabel = 'Prod. Matéria Seca';
            productionUnit = 'ton/ha/ano';
            productionStep = 1;
            break;
        case 'Grão/Concentrado':
            productionLabel = 'Prod. de Grãos';
            productionUnit = 'kg/ha';
            productionStep = 10;
            break;
    }

    const handleNameChange = (newName: string) => {
      const selectedForage = catalogoDeCulturas.find(c => c.nome === newName);
      if (selectedForage) {
          onForageInputChange(forage.id, 'name', selectedForage.nome);
          onForageInputChange(forage.id, 'uso', selectedForage.uso);
          onForageInputChange(forage.id, 'productionValue', selectedForage.productionValue);
          onForageInputChange(forage.id, 'costPerHectare', selectedForage.costPerHectare);
      }
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-md relative">
            <button 
                onClick={() => onRemove(forage.id)}
                className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                aria-label="Remover Lavoura"
            >
                <Icon name="trash" className="w-4 h-4" />
            </button>
            <div className="flex justify-between items-center mb-4">
                 <select 
                    value={forage.name} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg font-bold text-green-700"
                 >
                    {catalogoDeCulturas.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                 </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Área" value={forage.areaHa} onChange={(val) => onForageInputChange(forage.id, 'areaHa', val)} unit="ha" step={0.5} />
                <Input label={productionLabel} value={forage.productionValue} onChange={(val) => onForageInputChange(forage.id, 'productionValue', val)} unit={productionUnit} step={productionStep} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Uso Padrão: {forage.uso}</p>

            {forage.uso === 'Pasto' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-2 border-t pt-4">
                    <Input label="Dias de Descanso" value={forage.restDays} onChange={(val) => onForageInputChange(forage.id, 'restDays', val)} unit="dias" />
                    <Input label="Dias de Pastejo" value={forage.occupationDays} onChange={(val) => onForageInputChange(forage.id, 'occupationDays', val)} unit="dias" />
                </div>
            )}
        </div>
    );
};


export const PastoModule: React.FC<PastoModuleProps> = ({ inputs, results, onInputChange, onForageInputChange, addForage, removeForage }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Módulo Pasto: Planejamento da Terra</h2>

      <div className="p-4 bg-white rounded-xl shadow-md">
        <div className="flex items-center mb-2">
            <h3 className="font-semibold text-lg">Consumo a Pasto</h3>
            <InfoTooltip text="Este é o consumo médio do rebanho durante o período das águas." />
        </div>
        <Slider
          label="Quanto o animal come no Pasto (% do Peso)"
          value={inputs.consumo_forragem_pv_piquetes}
          onChange={(val) => onInputChange('consumo_forragem_pv_piquetes', val)}
          min={1} max={5} step={0.1} unit="%"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Manejo de Lavouras e Forrageiras</h3>
            <button onClick={addForage} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Adicionar Lavoura</button>
        </div>
         {inputs.forages.length > 0 ? (
            <div className="space-y-4">
                {inputs.forages.map(forage => (
                    <ForageCard key={forage.id} forage={forage} onForageInputChange={onForageInputChange} onRemove={removeForage} />
                ))}
            </div>
        ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                <p className="text-gray-500">Nenhuma lavoura adicionada.</p>
                <p className="text-sm text-gray-400">Clique em "Adicionar Lavoura" para começar.</p>
            </div>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Dimensionamento de Piquetes</h3>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Tipo de Capim (Uso: Pasto)</th>
                <th className="p-3 font-semibold text-center">Nº de Piquetes</th>
                <th className="p-3 font-semibold text-center">Área por Piquete</th>
                <th className="p-3 font-semibold text-center">Medidas da Cerca</th>
              </tr>
            </thead>
            <tbody>
              {results.piquete_results.length > 0 ? results.piquete_results.map((res, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 font-medium text-gray-800">{res.forageName}</td>
                  <td className="p-3 text-center">{res.numPiquetes.toFixed(0)}</td>
                  <td className="p-3 text-center">{res.areaPorPiqueteM2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m²</td>
                  <td className="p-3 text-center">{`${res.comprimentoPiqueteM.toFixed(1)} x ${res.larguraPiqueteM.toFixed(1)} m`}</td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">Nenhuma forrageira designada para "Pasto".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
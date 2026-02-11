
import React from 'react';
import { CalculatedResults } from '../../types';
import { Card } from '../ui/Card';
import { InfoTooltip } from '../ui/InfoTooltip';
import { BarChart } from '../ui/BarChart';

interface DashboardModuleProps {
  results: CalculatedResults;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ results }) => {
  const balancoAnualDiasColor = results.balanco_anual_dias_deficit <= 0 ? 'bg-green-600' : 'bg-red-500';
  const balancoAnualDiasText = results.balanco_anual_dias_deficit <= 0
    ? `+${Math.abs(results.balanco_anual_dias_deficit).toFixed(0)} dias de sobra`
    : `Faltam ${results.balanco_anual_dias_deficit.toFixed(0)} dias`;

  const balancoAnualMSColor = results.balanco_ms_anual_ton >= 0 ? 'bg-blue-600' : 'bg-red-500';
  const balancoAnualMSText = results.balanco_ms_anual_ton >= 0
    ? `Superávit de ${results.balanco_ms_anual_ton.toFixed(2)} ton`
    : `Déficit de ${Math.abs(results.balanco_ms_anual_ton).toFixed(2)} ton`;

  const ofertaDemandaChartData = {
    labels: ['Demanda Anual', 'Oferta Anual'],
    datasets: [
        {
            label: 'Balanço de Matéria Seca (toneladas)',
            data: [results.demanda_ms_anual_ton, results.oferta_ms_anual_ton],
            backgroundColor: ['#F87171', '#34D399'],
        },
    ],
  };

  const suporteSecaChartData = {
    labels: ['1ª Colheita', 'Com Rebrota'],
    datasets: [
        {
            label: 'Lotação da Terra (UA/ha no período)',
            data: [results.lotacao_periodo_ua_ha_ciclo_unico, results.lotacao_periodo_ua_ha_ciclo_total],
            backgroundColor: ['#FBBF24', '#F59E0B'],
        },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {!results.is_valid && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg shadow-md" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="font-bold">Erro Crítico: Limite Biológico Excedido</p>
                        <p className="text-sm">O consumo de Matéria Seca não pode exceder o limite de segurança. Ajuste os valores no Módulo Animal para continuar.</p>
                    </div>
                </div>
            </div>
        )}

        {results.is_valid && results.balanco_anual_dias_deficit > 0 && (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-md" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">Atenção: Ciclo Anual Incompleto</p>
                        <p className="text-sm">Seu planejamento atual cobre apenas <strong>{results.balanco_anual_dias_total.toFixed(0)}</strong> dias do ano. Faltam <strong>{results.balanco_anual_dias_deficit.toFixed(0)}</strong> dias para fechar o ciclo.</p>
                    </div>
                </div>
            </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Painel de Controle da Fazenda</h2>
        
        {/* CUSTOS */}
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Resumo de Custos</h3>
                <InfoTooltip text="Análise financeira baseada nos custos de produção, ensilagem e concentrado inseridos nos Módulos de Custo e Lavoura." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card title="Custo Total de Produção" value={`R$ ${results.custo_total_producao.toLocaleString('pt-BR', {maximumFractionDigits: 0})}`} unit="Anual" icon="tractor" color="bg-teal-600" />
                <Card title="Custo Alimentação Diário (Seca)" value={`R$ ${results.custo_alimentacao_diario.toLocaleString('pt-BR', {maximumFractionDigits: 2})}`} unit="Total" icon="silo" color="bg-teal-500" />
                <Card title="Custo por Animal/Dia (Seca)" value={`R$ ${results.custo_por_animal_dia.toFixed(2)}`} unit="por cabeça" icon="cow" color="bg-teal-400" />
            </div>
        </div>

        {/* BALANÇO ANUAL */}
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Balanço Anual de Forragem (365 dias)</h3>
                <InfoTooltip text="Análise completa do seu planejamento, comparando a comida que você precisa (Demanda) com a que você produz (Oferta)." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card title="Balanço de Dias de Comida" value={results.balanco_anual_dias_total.toFixed(0)} unit="dias" icon="calendar" color={balancoAnualDiasColor} extraInfo={balancoAnualDiasText} />
                <Card title="Balanço de Matéria Seca" value={results.balanco_ms_anual_ton.toFixed(2)} unit="toneladas" icon="silo" color={balancoAnualMSColor} extraInfo={balancoAnualMSText} />
            </div>
            <BarChart data={ofertaDemandaChartData} />
        </div>

        {/* SUPORTE NA SECA */}
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Suporte na SECA (Silagem)</h3>
                <InfoTooltip text="Quantas Unidades Animais (UA = 450kg) um hectare de silagem suporta durante toda a seca." />
            </div>
            <BarChart data={suporteSecaChartData} />
        </div>
    </div>
  );
};
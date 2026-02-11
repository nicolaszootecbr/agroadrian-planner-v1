
import React from 'react';
import { CalculatedResults, MotorZootecniaData } from '../../types';
import { Icon, IconName } from '../ui/Icon';
import { BarChart } from '../ui/BarChart';
import { PieChart } from '../ui/PieChart';

interface LaudoTecnicoProps {
  results: CalculatedResults;
  inputs: MotorZootecniaData;
}

const ReportSection: React.FC<{ icon: IconName; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="border border-gray-200 rounded-lg p-4 print-no-break">
        <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 rounded-full text-green-700 mr-3">
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

const InterpretationGuide: React.FC<{results: CalculatedResults, inputs: MotorZootecniaData}> = ({ results, inputs }) => {
    return (
        <ReportSection icon="document" title="Guia AgroAdrian de Interpretação">
            <p className="text-sm text-gray-600 mb-4">Este guia traduz os números do seu planejamento em decisões práticas para o dia a dia da fazenda.</p>
            <ul className="space-y-3 text-sm">
                <li>
                    <strong className="text-gray-800">Hectares de Roça para Silagem:</strong> 
                    {results.estoque_deficit_superavit_ha >= 0 ?
                        <span> Você planejou <strong className="text-green-600">{results.debug_total_silage_area_ha.toFixed(2)} ha</strong>, e sua necessidade é de <strong className="text-green-600">{results.area_necessaria_final_ha.toFixed(2)} ha</strong>. Ótimo! Há uma margem de segurança.</span> :
                        <span> Atenção! Você precisa de <strong className="text-red-600">{results.area_necessaria_final_ha.toFixed(2)} ha</strong>, mas planejou apenas <strong className="text-red-600">{results.debug_total_silage_area_ha.toFixed(2)} ha</strong>. É preciso aumentar a área para não faltar comida.</span>
                    }
                </li>
                 <li>
                    <strong className="text-gray-800">Balanço de Dias de Comida:</strong> 
                    {results.balanco_anual_dias_deficit <= 0 ? 
                        <span> Parabéns! Com <strong className="text-green-600">{Math.abs(results.balanco_anual_dias_deficit).toFixed(0)} dias de sobra</strong>, você tem segurança alimentar. Isso pode permitir um aumento no rebanho ou a venda de excedente de forragem.</span> :
                        <span> Atenção! Faltam <strong className="text-red-600">{results.balanco_anual_dias_deficit.toFixed(0)} dias</strong> para fechar o ano. Você precisará comprar volumoso externo ou ajustar a área de plantio.</span>
                    }
                </li>
                 <li>
                    <strong className="text-gray-800">Lotação da Terra (UA/ha):</strong> 
                    <span> Seu planejamento indica uma lotação de <strong className="text-blue-600">{results.lotacao_periodo_ua_ha_ciclo_total.toFixed(2)} UA/ha</strong> durante a seca. Valores altos (acima de 6-7 UA/ha) exigem manejo intensivo e um rigoroso plano de adubação para sustentar a produtividade.</span>
                </li>
                 <li>
                    <strong className="text-gray-800">Fatia Mínima do Silo:</strong> 
                    <span> Para manter a qualidade da sua silagem e evitar que ela "esquente" (deterioração aeróbica), é crucial retirar no mínimo <strong className="text-yellow-700">{inputs.fatia_retirada_minima_m * 100} cm</strong> do painel todos os dias. O seu silo foi dimensionado para isso.</span>
                </li>
            </ul>
        </ReportSection>
    );
}


export const LaudoTecnico: React.FC<LaudoTecnicoProps> = ({ results, inputs }) => {
    const today = new Date().toLocaleDateString('pt-BR');

    const ofertaDemandaChartData = {
        labels: ['Demanda MS', 'Oferta MS'],
        datasets: [{
            label: 'Balanço de Matéria Seca (toneladas/ano)',
            data: [results.demanda_ms_anual_ton, results.oferta_ms_anual_ton],
            backgroundColor: ['#F87171', '#34D399'],
        }],
    };

    const costPieChartData = {
        data: [results.custo_componente_pasto_total, results.custo_componente_silagem_total, results.custo_componente_concentrado_total],
        labels: ['Custo Pasto', 'Custo Silagem', 'Custo Concentrado'],
        colors: ['#34D399', '#FBBF24', '#F87171']
    };

    const pasturePercentage = (results.autonomia_pasto_dias / 365) * 100;
    const silagePercentage = (results.autonomia_estoque_dias / 365) * 100;

  return (
    <div className="bg-white p-8 font-sans">
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-green-800">AgroAdrian Planner</h1>
        <p className="text-lg text-gray-700 -mt-1">Laudo de Planejamento Forrageiro</p>
        <p className="text-gray-600 text-sm mt-2">Relatório gerado em: {today}</p>
      </header>

      <main className="space-y-6">
        {/* ROW 1: Calendário e Produção */}
        <div className="grid grid-cols-2 gap-6">
            <ReportSection icon="calendar" title="Calendário de Segurança">
                <p className="text-sm text-gray-600 mb-2">Balanço de dias de comida para o rebanho durante o ano.</p>
                <div className="w-full bg-gray-200 rounded-full h-6 my-2 flex overflow-hidden">
                    <div className="bg-green-500 h-6 text-white text-xs flex items-center justify-center" style={{ width: `${pasturePercentage}%` }} title={`Dias de Pasto: ${results.autonomia_pasto_dias.toFixed(0)}`}>Pasto</div>
                    <div className="bg-yellow-500 h-6 text-white text-xs flex items-center justify-center" style={{ width: `${silagePercentage}%` }} title={`Dias de Silo: ${results.autonomia_estoque_dias.toFixed(0)}`}>Silo</div>
                </div>
                 <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>Início</span>
                    <span>365 dias</span>
                </div>
                 <div className="mt-4 text-center">
                    {results.balanco_anual_dias_deficit > 0 
                        ? <p className="font-bold text-red-600">⚠️ Faltam {results.balanco_anual_dias_deficit.toFixed(0)} dias para fechar o ciclo!</p>
                        : <p className="font-bold text-green-600">✅ Ciclo anual coberto com {Math.abs(results.balanco_anual_dias_deficit).toFixed(0)} dias de sobra.</p>
                    }
                </div>
            </ReportSection>

            <ReportSection icon="tractor" title="Produção de Alimento">
                 <p className="text-sm text-gray-600 mb-2">Comparativo entre a comida produzida e a necessária.</p>
                 <BarChart data={ofertaDemandaChartData} />
                 <p className="text-center mt-2 font-semibold text-gray-800">Hectares de Roça para Plantar: <span className="text-green-700">{results.area_necessaria_final_ha.toFixed(2)} ha</span></p>
            </ReportSection>
        </div>

        {/* ROW 2: Demanda e Reserva */}
        <div className="grid grid-cols-2 gap-6">
             <ReportSection icon="cow" title="Demanda do Rebanho (Seca)">
                <p className="text-sm text-gray-600 mb-2">"Receita do Cocho" por categoria para o período da seca.</p>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-semibold">Categoria / Lote</th>
                            <th className="p-2 font-semibold text-center">Qtd. Animais</th>
                            <th className="p-2 font-semibold text-right">Silagem (kg/dia)</th>
                            <th className="p-2 font-semibold text-right">Concentrado (kg/dia)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.trato_diario_por_categoria.map((trato, i) => {
                       const category = inputs.siloMode === 'advanced' 
                            ? inputs.animalCategories.find(c => c.name === trato.categoryName)
                            : { count: inputs.numero_de_animais };
                        return(
                        <tr key={i} className="border-t">
                            <td className="p-2">{trato.categoryName}</td>
                            <td className="p-2 text-center">{category?.count ?? 'N/A'}</td>
                            <td className="p-2 text-right">{trato.silagem_mn_kg.toFixed(1)}</td>
                            <td className="p-2 text-right">{trato.concentrado_mn_kg.toFixed(1)}</td>
                        </tr>
                    )})}
                    </tbody>
                </table>
                 <p className="text-xs text-gray-500 mt-2">*Valores em Matéria Natural (como servido no cocho), por animal.</p>
            </ReportSection>
            
             <ReportSection icon="money" title="Análise de Custos">
                <PieChart data={costPieChartData.data} labels={costPieChartData.labels} colors={costPieChartData.colors} />
            </ReportSection>
        </div>

        {/* ROW 3: Aproveitamento */}
        <ReportSection icon="grass" title="Aproveitamento por Forrageira">
            <p className="text-sm text-gray-600 mb-2">Detalhamento do uso da terra e produção por tipo de capim.</p>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 font-semibold">Forrageira</th>
                        <th className="p-2 font-semibold">Uso</th>
                        <th className="p-2 font-semibold text-right">Área (ha)</th>
                        <th className="p-2 font-semibold text-right">Produção</th>
                    </tr>
                </thead>
                <tbody>
                {inputs.forages.filter(f => f.areaHa > 0).map((forage, i) => (
                    <tr key={i} className="border-t">
                        <td className="p-2">{forage.name}</td>
                        <td className="p-2">{forage.uso}</td>
                        <td className="p-2 text-right">{forage.areaHa.toFixed(2)}</td>
                        <td className="p-2 text-right">
                            {forage.productionValue.toLocaleString('pt-BR')} 
                            <span className="text-xs text-gray-500 ml-1">{forage.uso === 'Pasto' ? 'ton/ha/ano' : 'kg/ha'}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </ReportSection>

        {/* ROW 4: Interpretation */}
        <InterpretationGuide results={results} inputs={inputs} />

      </main>

      <footer className="text-center mt-8 pt-4 border-t">
        <p className="text-xs text-gray-500">Este laudo é uma ferramenta de apoio à decisão e não substitui a consulta a um profissional qualificado. Os resultados são baseados nos dados fornecidos pelo usuário.</p>
        <p className="text-xs text-gray-500 font-semibold">AgroAdrian Planner - Inovação a serviço do campo.</p>
      </footer>
    </div>
  );
};

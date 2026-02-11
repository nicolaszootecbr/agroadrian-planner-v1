
import { useState, useMemo, useCallback } from 'react';
import { MotorZootecniaData, CalculatedResults, ForageData, AnimalCategory } from '../types';
import { calculateScenario } from '../services/motorZootecnia';
import { catalogoDeCulturas } from '../data/catalogo';

const SCENARIO_STORAGE_KEY = 'agroAdrianPlannerScenario';

const defaultAnimalCategories: AnimalCategory[] = [];
const defaultForages: ForageData[] = [];

const defaultInputs: MotorZootecniaData = {
    // Módulo Animal
    relacao_volumoso_concentrado: 80,
    teor_ms_concentrado: 88,
    sobras_de_cocho_geral: 5,
    numero_de_animais: 30,
    peso_medio_categoria_kg: 450,
    consumo_de_ms_por_pv_do_animal: 2.7,
    
    // Módulo Terra
    rebrota_percent: 50,
    perdas_colheita_transporte: 6,
    perdas_armazenamento: 14,
    perdas_consumo_cocho: 6,
    perdas_rebrota_colheita: 6,
    perdas_rebrota_armazenamento: 17.5,
    perdas_rebrota_consumo: 6,

    // Módulo Silo
    siloMode: 'basic',
    animalCategories: defaultAnimalCategories,
    periodo_de_consumo_da_silagem: 180,
    teor_de_ms_da_silagem: 33,
    silo_altura: 2.5,
    silo_largura_topo: 8,
    densidade_silagem_kg_m3: 600,
    fatia_retirada_minima_m: 0.30,

    // Módulo Pasto
    consumo_forragem_pv_piquetes: 3.5,
    forages: defaultForages,

    // Módulo Custos
    custo_ensilagem_ha: 750,
    custo_concentrado_kg_ms: 2.20,
};

export const useZootecnia = () => {
    const [inputs, setInputs] = useState<MotorZootecniaData>(() => {
        try {
            const savedData = localStorage.getItem(SCENARIO_STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : defaultInputs;
        } catch (error) {
            console.error("Failed to load scenario from localStorage", error);
            return defaultInputs;
        }
    });

    const setInput = useCallback((field: keyof Omit<MotorZootecniaData, 'forages' | 'animalCategories' | 'siloMode'>, value: number) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    }, []);

    const setSiloMode = useCallback((mode: 'basic' | 'advanced') => {
        setInputs(prev => ({ ...prev, siloMode: mode }));
    }, []);

    const setForageInput = useCallback(<K extends keyof Omit<ForageData, 'id'>>(id: number, field: K, value: ForageData[K]) => {
        setInputs(prev => ({
            ...prev,
            forages: prev.forages.map(f => f.id === id ? { ...f, [field]: value } : f)
        }));
    }, []);

    const setAnimalCategoryInput = useCallback((id: number, field: keyof Omit<AnimalCategory, 'id' | 'name'>, value: number) => {
        setInputs(prev => ({
            ...prev,
            animalCategories: prev.animalCategories.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    }, []);

    const addForage = useCallback(() => {
        setInputs(prev => {
            const newForageTemplate = catalogoDeCulturas[0]; // Default to the first item: Milho Silagem
            const newForage: ForageData = {
                id: Date.now(),
                name: newForageTemplate.nome,
                uso: newForageTemplate.uso,
                productionValue: newForageTemplate.productionValue,
                costPerHectare: newForageTemplate.costPerHectare,
                areaHa: 1, // Start with 1ha to encourage input
                restDays: 30,
                occupationDays: 2,
            };
            return { ...prev, forages: [...prev.forages, newForage] };
        });
    }, []);

    const removeForage = useCallback((id: number) => {
        setInputs(prev => ({ ...prev, forages: prev.forages.filter(f => f.id !== id) }));
    }, []);

    const addAnimalCategory = useCallback(() => {
        setInputs(prev => {
            const newCategory: AnimalCategory = {
                id: Date.now(),
                name: `Lote ${prev.animalCategories.length + 1}`,
                count: 10, // Start with a default value
                weight: 450, // Start with a default value
                msConsumptionPercent: 2.7
            };
            return { ...prev, animalCategories: [...prev.animalCategories, newCategory] };
        });
    }, []);

    const removeAnimalCategory = useCallback((id: number) => {
        setInputs(prev => ({ ...prev, animalCategories: prev.animalCategories.filter(c => c.id !== id) }));
    }, []);

    const results: CalculatedResults = useMemo(() => calculateScenario(inputs), [inputs]);

    const saveScenario = useCallback(() => {
        try {
            localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(inputs));
            alert('Cenário salvo com sucesso!');
        } catch (error) {
            console.error("Failed to save scenario to localStorage", error);
            alert('Erro ao salvar o cenário.');
        }
    }, [inputs]);

    const resetScenario = useCallback(() => {
        localStorage.removeItem(SCENARIO_STORAGE_KEY);
        setInputs(defaultInputs);
    }, []);
    
    const generateWhatsAppSummary = useCallback(() => {
        let summary = `*Resumo do Planejamento Anual - AgroAdrian Planner*%0A%0A`;
        summary += `*🗓️ BALANÇO 365 DIAS*%0A`;
        summary += `Tempo de Pasto Solto: *${results.autonomia_pasto_dias.toFixed(0)} dias*%0A`;
        summary += `Dias de Trato Garantidos: *${results.autonomia_estoque_dias.toFixed(0)} dias*%0A`;
        summary += `Total de *${results.balanco_anual_dias_total.toFixed(0)} dias* de comida garantida.%0A%0A`;
        
        if (results.balanco_anual_dias_deficit > 0) {
            summary += `*⚠️ ATENÇÃO: Faltam ${results.balanco_anual_dias_deficit.toFixed(0)} dias para fechar o ciclo anual!*%0A%0A`;
        }

        summary += `*💰 CUSTOS*%0A`;
        summary += `Custo Total: *R$ ${results.custo_total_planejamento.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}*%0A`;
        summary += `Custo por Animal/Dia (Seca): *R$ ${results.custo_por_animal_dia.toFixed(2)}*%0A%0A`;

        summary += `*🌿 SUPORTE DA TERRA*%0A`;
        summary += `- *Lotação da Terra (Ciclo Total):* ${results.lotacao_periodo_ua_ha_ciclo_total.toFixed(2)} UA/ha no período%0A`;
        summary += `- *Nas Águas (Pasto):* ${results.lotacao_media_pasto_ua_ha_dia.toFixed(2)} UA/ha por dia%0A%0A`;

        summary += `*🍽️ TRATO DIÁRIO (por animal na seca)*%0A`;
        results.trato_diario_por_categoria.forEach(trato => {
            summary += `*- ${trato.categoryName}:*%0A`;
            summary += `  • Silagem: *${trato.silagem_mn_kg.toFixed(1)} kg*%0A`;
            summary += `  • Concentrado: *${trato.concentrado_mn_kg.toFixed(1)} kg*%0A`;
        });
        summary += `%0A*Obs: valores em Matéria Natural (como servido no cocho).*`;

        window.open(`https://wa.me/?text=${summary}`, '_blank');
    }, [results]);

    const generateAuditReport = useCallback(() => {
        const now = new Date();
        const timestamp = now.toLocaleString('pt-BR');
        
        let report = `Relatório Gerado pelo AgroAdrian Planner - ${timestamp}\n\n`;
        report += `--- BLOCO A: AUDITORIA DE CONSUMO (ANIMAL) ---\n`;
        report += `Peso Médio Ponderado: ${results.debug_peso_medio_ponderado_kg.toFixed(2)} kg\n`;
        report += `Consumo Individual (MS): ${results.debug_consumo_ms_individual_kg_dia.toFixed(2)} kg/dia\n`;
        report += `Demanda Total do Lote (MS): ${results.consumo_total_lote_ms_dia.toFixed(2)} kg/dia\n`;
        report += `Demanda Total do Lote (MN Volumoso): ${results.debug_demanda_lote_mn_dia_kg.toFixed(2)} kg/dia\n`;
        report += `Relação Volumoso:Concentrado: ${inputs.relacao_volumoso_concentrado}% : ${100 - inputs.relacao_volumoso_concentrado}%\n\n`;

        report += `--- BLOCO B: AUDITORIA DE PRODUÇÃO (TERRA) ---\n`;
        report += `Produção Média Ponderada (BFFT): ${results.debug_weighted_avg_bfft_kg_ha.toFixed(2)} kg/ha\n`;
        report += `Área Total de Silagem: ${results.debug_total_silage_area_ha.toFixed(2)} ha\n`;
        report += `Área Total de Pasto: ${results.debug_total_pasture_area_ha.toFixed(2)} ha\n`;
        report += `Total Pós-Colheita (BFFE): ${results.debug_bffe_kg_ha.toFixed(2)} kg/ha\n`;
        report += `Total Pós-Armazenamento (BSFS): ${results.debug_bsfs_kg_ha.toFixed(2)} kg/ha\n`;
        report += `Total Pós-Consumo (BFSC): ${results.debug_bfsc_kg_ha.toFixed(2)} kg/ha\n`;
        report += `Total da Rebrota (BFSC Rebrota): ${results.debug_rebrota_bfsc_kg_ha.toFixed(2)} kg/ha\n\n`;

        report += `--- BLOCO C: AUDITORIA DE SUPORTE (LOTAÇÃO) ---\n`;
        report += `Suporte Diário (1ª Colheita): ${results.debug_suporte_diario_ua_ha_ciclo_unico.toFixed(2)} UA/ha/dia\n`;
        report += `Suporte Diário (Com Rebrota): ${results.debug_suporte_diario_ua_ha_ciclo_total.toFixed(2)} UA/ha/dia\n`;
        report += `Área Necessária (Período): ${results.area_necessaria_final_ha.toFixed(2)} ha\n\n`;

        report += `--- BLOCO D: AUDITORIA DE ENGENHARIA (SILO) ---\n`;
        report += `Área do Painel (Trapézio): ${results.debug_area_trapezio_m2.toFixed(2)} m²\n`;
        report += `Volume da Fatia Mínima: ${results.debug_volume_fatia_diaria_m3.toFixed(2)} m³/dia\n`;
        report += `Peso da Fatia Mínima: ${results.debug_peso_fatia_diaria_kg.toFixed(2)} kg/dia\n`;
        report += `Largura de Cima (B): ${inputs.silo_largura_topo.toFixed(2)} m\n`;
        report += `Largura do Fundo (b): ${results.silo_largura_fundo_m.toFixed(2)} m\n`;
        report += `Altura (h): ${inputs.silo_altura.toFixed(2)} m\n`;
        report += `Comprimento (C): ${results.silo_comprimento_m.toFixed(2)} m\n`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_auditoria_${now.toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }, [inputs, results]);

    return { inputs, setInput, setForageInput, setAnimalCategoryInput, setSiloMode, results, saveScenario, generateWhatsAppSummary, generateAuditReport, resetScenario, addForage, removeForage, addAnimalCategory, removeAnimalCategory };
};
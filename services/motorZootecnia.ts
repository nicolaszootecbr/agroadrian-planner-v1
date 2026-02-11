
import { MotorZootecniaData, CalculatedResults } from '../types';
import { travas } from '../data/catalogo';

function _se(condition: boolean, val_true: any, val_false: any) {
    return condition ? val_true : val_false;
}

export function calculateScenario(data: MotorZootecniaData): CalculatedResults {
    const res: Partial<CalculatedResults> = {};

    // --- BIOLOGICAL VALIDATION ---
    const isAdvancedValid = data.animalCategories.every(c => c.msConsumptionPercent <= travas.consumo_max);
    const isBasicValid = data.consumo_de_ms_por_pv_do_animal <= travas.consumo_max;
    res.is_valid = data.siloMode === 'advanced' ? isAdvancedValid : isBasicValid;

    if (!res.is_valid) {
        const defaultErrorState: CalculatedResults = {
            is_valid: false, custo_total_planejamento: 0, custo_por_animal_dia: 0, area_necessaria_final_ha: 0,
            autonomia_estoque_dias: 0, silo_status_divisao: 'ADEQUADO', demanda_volumoso_com_perdas_ton_mn: 0,
            piquete_results: [], silo_largura_fundo_m: 0, silo_comprimento_m: 0, consumo_total_lote_ms_dia: 0,
            silo_volume_m3: 0, silo_tonelagem_mn: 0, estoque_deficit_superavit_ha: 0, trato_diario_por_categoria: [],
            consumo_por_categoria: [], consumo_ms_ua_dia: 0, consumo_silagem_fresca_ua_dia: 0,
            lotacao_periodo_ua_ha_ciclo_unico: 0, lotacao_periodo_ua_ha_ciclo_total: 0, autonomia_pasto_dias: 0,
            balanco_anual_dias_total: 0, balanco_anual_dias_deficit: 0, demanda_ms_anual_ton: 0,
            oferta_ms_anual_ton: 0, balanco_ms_anual_ton: 0, lotacao_media_pasto_ua_ha_dia: 0,
            debug_peso_medio_ponderado_kg: 0, debug_consumo_ms_individual_kg_dia: 0,
            debug_demanda_lote_mn_dia_kg: 0, debug_bffe_kg_ha: 0, debug_bsfs_kg_ha: 0, debug_bfsc_kg_ha: 0,
            debug_rebrota_bfsc_kg_ha: 0, debug_suporte_diario_ua_ha_ciclo_unico: 0,
            debug_suporte_diario_ua_ha_ciclo_total: 0, debug_area_trapezio_m2: 0,
            debug_volume_fatia_diaria_m3: 0, debug_peso_fatia_diaria_kg: 0, debug_total_silage_area_ha: 0,
            debug_total_pasture_area_ha: 0, debug_weighted_avg_bfft_kg_ha: 0, custo_total_producao: 0,
            custo_alimentacao_diario: 0, custo_componente_pasto_total: 0, custo_componente_silagem_total: 0,
            custo_componente_concentrado_total: 0,
        };
        return defaultErrorState;
    }

    // --- PRÉ-CÁLCULO DINÂMICO DE ÁREAS E PRODUÇÃO ---
    const silageForages = data.forages.filter(f => f.uso === 'Silagem' && f.areaHa > 0);
    const pastureForages = data.forages.filter(f => f.uso === 'Pasto' && f.areaHa > 0);

    res.debug_total_silage_area_ha = silageForages.reduce((acc, f) => acc + f.areaHa, 0);
    res.debug_total_pasture_area_ha = pastureForages.reduce((acc, f) => acc + f.areaHa, 0);
    
    const totalSilageProductionKg = silageForages.reduce((acc, f) => acc + (f.productionValue * f.areaHa), 0);
    res.debug_weighted_avg_bfft_kg_ha = totalSilageProductionKg / (res.debug_total_silage_area_ha || 1);

    const totalPastureProductionMsTon = pastureForages.reduce((acc, f) => acc + (f.productionValue * f.areaHa), 0);
    const weightedAvgPastureMsTonHaAno = totalPastureProductionMsTon / (res.debug_total_pasture_area_ha || 1);
    const oferta_media_ms_pasto_ha_dia_kg = (weightedAvgPastureMsTonHaAno * 1000) / 365;

    // --- VARIÁVEIS DE ENTRADA ---
    const teor_ms_silagem_decimal = data.teor_de_ms_da_silagem / 100 || 1;
    const teor_ms_concentrado_decimal = data.teor_ms_concentrado / 100 || 1;
    const pct_volumoso = data.relacao_volumoso_concentrado / 100;
    const pct_concentrado = 1 - pct_volumoso;
    const fator_sobra = 1 + (data.sobras_de_cocho_geral / 100);
    
    // --- DADOS GERAIS DO REBANHO ---
    const numero_total_animais = data.siloMode === 'advanced' ? data.animalCategories.reduce((acc, cat) => acc + cat.count, 0) : data.numero_de_animais;
    const peso_medio_ponderado = data.siloMode === 'advanced'
        ? data.animalCategories.reduce((acc, cat) => acc + cat.count * cat.weight, 0) / (numero_total_animais || 1)
        : data.peso_medio_categoria_kg;
    res.debug_peso_medio_ponderado_kg = peso_medio_ponderado;

    // --- CONSUMO & MAPA DE TRATO (PERÍODO DA SECA/SILO) ---
    res.trato_diario_por_categoria = [];
    res.consumo_por_categoria = [];
    let consumo_total_volumoso_ms_dia_silo = 0;
    let consumo_total_concentrado_ms_dia_silo = 0;
    res.consumo_total_lote_ms_dia = 0;

    if (data.siloMode === 'advanced') {
        data.animalCategories.forEach(cat => {
            if (cat.count > 0 && cat.weight > 0) {
                res.consumo_total_lote_ms_dia += cat.count * cat.weight * (cat.msConsumptionPercent / 100);
            }
        });
        data.animalCategories.forEach(cat => {
            if (cat.count > 0 && cat.weight > 0 && cat.msConsumptionPercent > 0) {
                const consumo_ms_animal = cat.weight * (cat.msConsumptionPercent / 100);
                const consumo_ms_categoria = cat.count * consumo_ms_animal;
                const silagem_ms_animal = consumo_ms_animal * pct_volumoso;
                const concentrado_ms_animal = consumo_ms_animal * pct_concentrado;
                consumo_total_volumoso_ms_dia_silo += cat.count * silagem_ms_animal;
                consumo_total_concentrado_ms_dia_silo += cat.count * concentrado_ms_animal;
                res.consumo_por_categoria.push({ categoryName: cat.name, consumo_ms_kg: consumo_ms_categoria, percentual_total: (consumo_ms_categoria / (res.consumo_total_lote_ms_dia || 1)) * 100 });
                res.trato_diario_por_categoria.push({ categoryName: cat.name, silagem_ms_kg: silagem_ms_animal * fator_sobra, silagem_mn_kg: (silagem_ms_animal * fator_sobra) / teor_ms_silagem_decimal, concentrado_ms_kg: concentrado_ms_animal * fator_sobra, concentrado_mn_kg: (concentrado_ms_animal * fator_sobra) / teor_ms_concentrado_decimal });
            }
        });
    } else {
        res.consumo_total_lote_ms_dia = numero_total_animais * peso_medio_ponderado * (data.consumo_de_ms_por_pv_do_animal / 100);
        const consumo_ms_animal = res.consumo_total_lote_ms_dia / (numero_total_animais || 1);
        const silagem_ms_animal = consumo_ms_animal * pct_volumoso;
        const concentrado_ms_animal = consumo_ms_animal * pct_concentrado;
        consumo_total_volumoso_ms_dia_silo = numero_total_animais * silagem_ms_animal;
        consumo_total_concentrado_ms_dia_silo = numero_total_animais * concentrado_ms_animal;
        res.trato_diario_por_categoria.push({ categoryName: 'Lote completo', silagem_ms_kg: silagem_ms_animal * fator_sobra, silagem_mn_kg: (silagem_ms_animal * fator_sobra) / teor_ms_silagem_decimal, concentrado_ms_kg: concentrado_ms_animal * fator_sobra, concentrado_mn_kg: (concentrado_ms_animal * fator_sobra) / teor_ms_concentrado_decimal });
    }
    res.debug_consumo_ms_individual_kg_dia = res.consumo_total_lote_ms_dia / (numero_total_animais || 1);

    // --- PLANEJAMENTO DE SILAGEM (SECA) ---
    const bfft_kg = res.debug_weighted_avg_bfft_kg_ha;
    res.debug_bffe_kg_ha = bfft_kg * (1 - data.perdas_colheita_transporte / 100);
    res.debug_bsfs_kg_ha = res.debug_bffe_kg_ha * (1 - data.perdas_armazenamento / 100);
    res.debug_bfsc_kg_ha = res.debug_bsfs_kg_ha * (1 - data.perdas_consumo_cocho / 100);
    const bffr_kg_bruto = bfft_kg * (data.rebrota_percent / 100);
    res.debug_rebrota_bfsc_kg_ha = bffr_kg_bruto * (1 - data.perdas_rebrota_colheita / 100) * (1 - data.perdas_rebrota_armazenamento / 100) * (1 - data.perdas_rebrota_consumo / 100);
    
    const total_mn_disponivel_ha_ciclo_unico = res.debug_bfsc_kg_ha;
    const total_mn_disponivel_ha_ciclo_total = total_mn_disponivel_ha_ciclo_unico + res.debug_rebrota_bfsc_kg_ha;
    const consumo_total_volumoso_mn_dia_silo = consumo_total_volumoso_ms_dia_silo / teor_ms_silagem_decimal;
    res.debug_demanda_lote_mn_dia_kg = consumo_total_volumoso_mn_dia_silo;

    res.area_necessaria_final_ha = (consumo_total_volumoso_mn_dia_silo * data.periodo_de_consumo_da_silagem) / (total_mn_disponivel_ha_ciclo_total || 1);
    res.estoque_deficit_superavit_ha = res.debug_total_silage_area_ha - res.area_necessaria_final_ha;
    
    const producao_silagem_ms_total_kg = total_mn_disponivel_ha_ciclo_total * res.debug_total_silage_area_ha * teor_ms_silagem_decimal;
    res.autonomia_estoque_dias = producao_silagem_ms_total_kg / (consumo_total_volumoso_ms_dia_silo || 1);

    // --- ENGENHARIA DE SILOS ---
    res.demanda_volumoso_com_perdas_ton_mn = (consumo_total_volumoso_mn_dia_silo * data.periodo_de_consumo_da_silagem) / 1000;
    res.silo_volume_m3 = (res.demanda_volumoso_com_perdas_ton_mn * 1000) / (data.densidade_silagem_kg_m3 || 1);
    const inclinacao_parede = 0.5;
    res.silo_largura_fundo_m = Math.max(0, data.silo_largura_topo - (2 * data.silo_altura * inclinacao_parede));
    res.debug_area_trapezio_m2 = ((res.silo_largura_fundo_m + data.silo_largura_topo) / 2) * data.silo_altura;
    res.silo_comprimento_m = res.silo_volume_m3 / (res.debug_area_trapezio_m2 || 1);
    res.silo_status_divisao = _se(res.silo_comprimento_m <= 30, "ADEQUADO", "RECOMENDADA DIVISÃO");
    res.debug_volume_fatia_diaria_m3 = res.debug_area_trapezio_m2 * data.fatia_retirada_minima_m;
    res.debug_peso_fatia_diaria_kg = res.debug_volume_fatia_diaria_m3 * data.densidade_silagem_kg_m3;

    // --- BALANÇO ANUAL (365 DIAS) ---
    res.autonomia_pasto_dias = Math.max(0, 365 - data.periodo_de_consumo_da_silagem);
    res.balanco_anual_dias_total = res.autonomia_pasto_dias + res.autonomia_estoque_dias;
    res.balanco_anual_dias_deficit = 365 - res.balanco_anual_dias_total;
    const consumo_ms_pasto_animal_dia = peso_medio_ponderado * (data.consumo_forragem_pv_piquetes / 100);
    const demanda_total_ms_pasto_dia = numero_total_animais * consumo_ms_pasto_animal_dia;
    const demanda_ms_pasto_total_kg = demanda_total_ms_pasto_dia * res.autonomia_pasto_dias;
    const demanda_ms_silo_total_kg = consumo_total_volumoso_ms_dia_silo * data.periodo_de_consumo_da_silagem;
    res.demanda_ms_anual_ton = (demanda_ms_pasto_total_kg + demanda_ms_silo_total_kg) / 1000;
    const oferta_ms_pasto_total_kg = oferta_media_ms_pasto_ha_dia_kg * res.debug_total_pasture_area_ha * res.autonomia_pasto_dias;
    res.oferta_ms_anual_ton = (oferta_ms_pasto_total_kg + producao_silagem_ms_total_kg) / 1000;
    res.balanco_ms_anual_ton = res.oferta_ms_anual_ton - res.demanda_ms_anual_ton;
    
    // --- MÉTRICAS DE EFICIÊNCIA ---
    res.consumo_ms_ua_dia = 450 * (data.consumo_de_ms_por_pv_do_animal / 100);
    res.consumo_silagem_fresca_ua_dia = (res.consumo_ms_ua_dia * pct_volumoso) / teor_ms_silagem_decimal;
    res.debug_suporte_diario_ua_ha_ciclo_unico = total_mn_disponivel_ha_ciclo_unico / (res.consumo_silagem_fresca_ua_dia || 1);
    res.debug_suporte_diario_ua_ha_ciclo_total = total_mn_disponivel_ha_ciclo_total / (res.consumo_silagem_fresca_ua_dia || 1);
    const consumo_total_mn_ua_periodo_silo = res.consumo_silagem_fresca_ua_dia * data.periodo_de_consumo_da_silagem;
    res.lotacao_periodo_ua_ha_ciclo_unico = total_mn_disponivel_ha_ciclo_unico / (consumo_total_mn_ua_periodo_silo || 1);
    res.lotacao_periodo_ua_ha_ciclo_total = total_mn_disponivel_ha_ciclo_total / (consumo_total_mn_ua_periodo_silo || 1);
    const consumo_ms_pasto_ua_dia = 450 * (data.consumo_forragem_pv_piquetes / 100);
    res.lotacao_media_pasto_ua_ha_dia = oferta_media_ms_pasto_ha_dia_kg / (consumo_ms_pasto_ua_dia || 1);

    // --- MANEJO DE PIQUETES ---
    res.piquete_results = pastureForages.map(forage => {
        const numPiquetes = Math.ceil((forage.restDays / forage.occupationDays) + 1);
        const areaPorPiqueteM2 = (forage.areaHa * 10000) / (numPiquetes || 1);
        const ladoPiqueteM = Math.sqrt(areaPorPiqueteM2);
        return { forageName: forage.name, numPiquetes, areaPorPiqueteM2, ladoPiqueteM, larguraPiqueteM: ladoPiqueteM, comprimentoPiqueteM: ladoPiqueteM };
    });

    // --- CÁLCULOS ECONÔMICOS ---
    res.custo_total_producao = data.forages.reduce((acc, f) => acc + (f.areaHa * f.costPerHectare), 0);
    
    const custo_producao_silagem = silageForages.reduce((acc, f) => acc + (f.areaHa * f.costPerHectare), 0);
    const custo_processo_ensilagem = res.debug_total_silage_area_ha * data.custo_ensilagem_ha;
    const custo_final_da_silagem = custo_producao_silagem + custo_processo_ensilagem;
    const custo_por_kg_ms_silagem = custo_final_da_silagem / (producao_silagem_ms_total_kg || 1);
    
    const custo_diario_volumoso_seca = consumo_total_volumoso_ms_dia_silo * custo_por_kg_ms_silagem;
    const custo_diario_concentrado_seca = consumo_total_concentrado_ms_dia_silo * data.custo_concentrado_kg_ms;
    res.custo_alimentacao_diario = custo_diario_volumoso_seca + custo_diario_concentrado_seca;
    
    res.custo_por_animal_dia = res.custo_alimentacao_diario / (numero_total_animais || 1);

    // Pie Chart Components
    res.custo_componente_pasto_total = pastureForages.reduce((acc, f) => acc + (f.areaHa * f.costPerHectare), 0);
    res.custo_componente_silagem_total = custo_final_da_silagem;
    res.custo_componente_concentrado_total = (consumo_total_concentrado_ms_dia_silo * data.periodo_de_consumo_da_silagem) * data.custo_concentrado_kg_ms;
    
    res.custo_total_planejamento = res.custo_componente_pasto_total + res.custo_componente_silagem_total + res.custo_componente_concentrado_total;
    
    // --- RETORNO COMPLETO ---
    return {
        ...res as CalculatedResults,
        area_necessaria_final_ha: res.area_necessaria_final_ha || 0,
        autonomia_estoque_dias: res.autonomia_estoque_dias || 0,
        silo_status_divisao: res.silo_status_divisao || 'ADEQUADO',
        demanda_volumoso_com_perdas_ton_mn: res.demanda_volumoso_com_perdas_ton_mn || 0,
        piquete_results: res.piquete_results || [],
        silo_largura_fundo_m: res.silo_largura_fundo_m || 0,
        silo_comprimento_m: res.silo_comprimento_m || 0,
        consumo_total_lote_ms_dia: res.consumo_total_lote_ms_dia || 0,
        silo_volume_m3: res.silo_volume_m3 || 0,
        silo_tonelagem_mn: (res.silo_volume_m3 * data.densidade_silagem_kg_m3) / 1000 || 0,
        estoque_deficit_superavit_ha: res.estoque_deficit_superavit_ha || 0,
        trato_diario_por_categoria: res.trato_diario_por_categoria || [],
        consumo_por_categoria: res.consumo_por_categoria || [],
        consumo_ms_ua_dia: res.consumo_ms_ua_dia || 0,
        consumo_silagem_fresca_ua_dia: res.consumo_silagem_fresca_ua_dia || 0,
        lotacao_periodo_ua_ha_ciclo_unico: res.lotacao_periodo_ua_ha_ciclo_unico || 0,
        lotacao_periodo_ua_ha_ciclo_total: res.lotacao_periodo_ua_ha_ciclo_total || 0,
        autonomia_pasto_dias: res.autonomia_pasto_dias || 0,
        balanco_anual_dias_total: res.balanco_anual_dias_total || 0,
        balanco_anual_dias_deficit: res.balanco_anual_dias_deficit || 0,
        demanda_ms_anual_ton: res.demanda_ms_anual_ton || 0,
        oferta_ms_anual_ton: res.oferta_ms_anual_ton || 0,
        balanco_ms_anual_ton: res.balanco_ms_anual_ton || 0,
        lotacao_media_pasto_ua_ha_dia: res.lotacao_media_pasto_ua_ha_dia || 0,
    };
}
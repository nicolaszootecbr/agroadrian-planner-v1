
export interface ForageData {
  id: number;
  name: string;
  restDays: number;
  occupationDays: number;
  productionValue: number; // For Silage: kg BFFT/ha/cut. For Pasture: ton MS/ha/year.
  uso: 'Pasto' | 'Silagem' | 'Grão/Concentrado';
  areaHa: number;
  costPerHectare: number;
}

export interface AnimalCategory {
  id: number;
  name: string;
  count: number;
  weight: number;
  msConsumptionPercent: number;
}

export interface MotorZootecniaData {
  // Módulo Animal
  relacao_volumoso_concentrado: number; // % de volumoso
  teor_ms_concentrado: number;
  sobras_de_cocho_geral: number;
  numero_de_animais: number; // Modo Básico
  peso_medio_categoria_kg: number; // Modo Básico
  consumo_de_ms_por_pv_do_animal: number; // Modo Básico
  
  // Módulo Terra (Perdas)
  rebrota_percent: number;
  perdas_colheita_transporte: number;
  perdas_armazenamento: number;
  perdas_consumo_cocho: number;
  perdas_rebrota_colheita: number;
  perdas_rebrota_armazenamento: number;
  perdas_rebrota_consumo: number;
  
  // Módulo Silo
  siloMode: 'basic' | 'advanced';
  animalCategories: AnimalCategory[];
  periodo_de_consumo_da_silagem: number;
  teor_de_ms_da_silagem: number;
  silo_altura: number;
  silo_largura_topo: number;
  densidade_silagem_kg_m3: number;
  fatia_retirada_minima_m: number;

  // Módulo Pasto
  consumo_forragem_pv_piquetes: number;
  forages: ForageData[];

  // Módulo Custos
  custo_ensilagem_ha: number;
  custo_concentrado_kg_ms: number;
}

export interface PiqueteResult {
  forageName: string;
  numPiquetes: number;
  areaPorPiqueteM2: number;
  ladoPiqueteM: number;
  larguraPiqueteM: number;
  comprimentoPiqueteM: number;
}

export interface TratoDiarioResult {
    categoryName: string;
    silagem_ms_kg: number;
    silagem_mn_kg: number;
    concentrado_ms_kg: number;
    concentrado_mn_kg: number;
}

export interface ConsumoCategoriaResult {
    categoryName: string;
    consumo_ms_kg: number;
    percentual_total: number;
}

export interface CalculatedResults {
  // Nível 1 (Coração do App)
  area_necessaria_final_ha: number;
  autonomia_estoque_dias: number;
  
  // Nível 2 (Manejo e Operacional)
  silo_status_divisao: 'ADEQUADO' | 'RECOMENDADA DIVISÃO';
  demanda_volumoso_com_perdas_ton_mn: number;
  piquete_results: PiqueteResult[];
  
  // Nível 3 (Dimensionamento Físico)
  silo_largura_fundo_m: number;
  silo_comprimento_m: number;
  
  // Outros resultados importantes
  consumo_total_lote_ms_dia: number;
  silo_volume_m3: number;
  silo_tonelagem_mn: number;
  estoque_deficit_superavit_ha: number;
  trato_diario_por_categoria: TratoDiarioResult[];
  consumo_por_categoria: ConsumoCategoriaResult[];

  // Métricas de Eficiência (Seca)
  consumo_ms_ua_dia: number;
  consumo_silagem_fresca_ua_dia: number;
  lotacao_periodo_ua_ha_ciclo_unico: number;
  lotacao_periodo_ua_ha_ciclo_total: number;

  // Métricas (Balanço Anual e Pasto)
  autonomia_pasto_dias: number;
  balanco_anual_dias_total: number;
  balanco_anual_dias_deficit: number;
  demanda_ms_anual_ton: number;
  oferta_ms_anual_ton: number;
  balanco_ms_anual_ton: number;
  lotacao_media_pasto_ua_ha_dia: number;

  // Novos Campos para Relatório de Auditoria
  debug_peso_medio_ponderado_kg: number;
  debug_consumo_ms_individual_kg_dia: number;
  debug_demanda_lote_mn_dia_kg: number;
  debug_bffe_kg_ha: number;
  debug_bsfs_kg_ha: number;
  debug_bfsc_kg_ha: number;
  debug_rebrota_bfsc_kg_ha: number;
  debug_suporte_diario_ua_ha_ciclo_unico: number;
  debug_suporte_diario_ua_ha_ciclo_total: number;
  debug_area_trapezio_m2: number;
  debug_volume_fatia_diaria_m3: number;
  debug_peso_fatia_diaria_kg: number;

  // Novos campos de debug para áreas dinâmicas
  debug_total_silage_area_ha: number;
  debug_total_pasture_area_ha: number;
  debug_weighted_avg_bfft_kg_ha: number;

  // Resultados Econômicos
  custo_total_planejamento: number;
  custo_por_animal_dia: number;
  custo_total_producao: number;
  custo_alimentacao_diario: number;
  custo_componente_pasto_total: number;
  custo_componente_silagem_total: number;
  custo_componente_concentrado_total: number;
  is_valid: boolean;
}

export enum Module {
    Dashboard = 'dashboard',
    Animal = 'animal',
    Terra = 'terra',
    Silo = 'silo',
    Pasto = 'pasto',
    Custo = 'custo',
    Report = 'report'
}
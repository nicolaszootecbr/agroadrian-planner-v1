
export const catalogoDeCulturas = [
    // Silagem (productionValue is kg BFFT/ha)
    { id: "s1", nome: "Milho Silagem", uso: 'Silagem', productionValue: 50000, costPerHectare: 7750 },
    { id: "s2", nome: "Sorgo Silagem", uso: 'Silagem', productionValue: 45000, costPerHectare: 6250 },
    // Pasto (productionValue is ton MS/ha/year)
    { id: "p1", nome: "Braquiária/Panicum", uso: 'Pasto', productionValue: 20, costPerHectare: 2250 },
    { id: "p2", nome: "Capim-Elefante Pastejo", uso: 'Pasto', productionValue: 40, costPerHectare: 4500 },
    // Grão (productionValue is kg Grãos/ha)
    { id: "c1", nome: "Milho Grão", uso: 'Grão/Concentrado', productionValue: 8000, costPerHectare: 6750 },
    { id: "c2", nome: "Soja Grão", uso: 'Grão/Concentrado', productionValue: 3750, costPerHectare: 5500 },
// FIX: Use 'as const' to have TypeScript infer literal types for the array properties.
// This ensures `uso` is typed as a union of literals, not a generic string.
] as const;

export const travas = {
  consumo_max: 4.5,
  alerta_metabolico: 4.0
};

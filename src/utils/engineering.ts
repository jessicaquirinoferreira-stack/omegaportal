/**
 * Electrical Engineering Calculations & Business Logic for Omega Engenharia
 * Adheres to Brazilian technical standards (ABNT NBR 5410, NBR 14039, NBR 5440, NBR 5356).
 */

export interface DemandCalculationInput {
  activePowerKw: number;       // Potência ativa instalada (kW)
  powerFactor?: number;        // Fator de potência (default 0.92 per ANEEL standard)
  diversityFactor?: number;    // Fator de simultaneidade/demanda (0.1 to 1.0)
  growthMarginPct?: number;    // Margem de expansão futura (%)
}

export interface DemandCalculationResult {
  apparentPowerKva: number;          // Demanda aparente calculada (kVA)
  recommendedKva: number;            // Potência comercial padronizada recomendada (kVA)
  voltageClassRecommendation: string; // Classe de tensão recomendada (BT, MT 15/34.5kV, AT até 500kV)
  substationType: string;            // Tipo de infraestrutura recomendada (Cabine Primária Simplificada, Convencional, Alvenaria/Blindada, Subestação de Pátio)
  primaryCurrentAmps13_8kV: number;  // Corrente nominal primária em 13,8 kV (A)
}

// Standard commercial transformer ratings in Brazil (kVA) per NBR 5440 / 5356
export const STANDARD_TRANSFORMER_RATINGS_KVA = [
  45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 5000, 7500, 10000, 15000
];

export function calculateTransformerDemand(input: DemandCalculationInput): DemandCalculationResult {
  const powerFactor = input.powerFactor && input.powerFactor > 0 ? input.powerFactor : 0.92;
  const diversityFactor = input.diversityFactor && input.diversityFactor > 0 ? input.diversityFactor : 0.8;
  const growth = input.growthMarginPct !== undefined ? input.growthMarginPct / 100 : 0.20; // 20% default growth

  // S (kVA) = (P_kW * F_demanda * (1 + Expansão)) / Fator de Potência
  const rawKva = (input.activePowerKw * diversityFactor * (1 + growth)) / powerFactor;
  const apparentPowerKva = Math.round(rawKva * 10) / 10;

  // Find the closest standard transformer rating that accommodates the load
  const recommendedKva = STANDARD_TRANSFORMER_RATINGS_KVA.find(rating => rating >= apparentPowerKva) 
    || Math.ceil(apparentPowerKva / 500) * 500;

  // Determine infrastructure type and voltage class
  let voltageClassRecommendation = 'Média Tensão - 15 kV (Classe 13,8 kV / 15 kV)';
  let substationType = 'Cabine Primária Convencional em Alvenaria ou Abrigada';

  if (recommendedKva <= 300) {
    substationType = 'Cabine Primária Simplificada / Poste Singelo (até 300 kVA)';
  } else if (recommendedKva <= 2500) {
    substationType = 'Cabine Primária Abrigada em Alvenaria ou Blindada (15 a 34,5 kV)';
    voltageClassRecommendation = 'Média Tensão - 15 a 34,5 kV';
  } else if (recommendedKva <= 10000) {
    substationType = 'Subestação Abrigada / Pátio Industrial com Barramentos Blindados (Bus Way)';
    voltageClassRecommendation = 'Média/Alta Tensão - 34,5 kV a 69 kV';
  } else {
    substationType = 'Subestação de Pátio de Alta Tensão (69 kV a 500 kV) com Bays e Transformadores de Força';
    voltageClassRecommendation = 'Alta Tensão - 69 kV até 500 kV';
  }

  // Primary nominal current in 13.8 kV: I = S / (sqrt(3) * V_kV)
  const primaryCurrentAmps13_8kV = Math.round((recommendedKva / (Math.sqrt(3) * 13.8)) * 100) / 100;

  return {
    apparentPowerKva,
    recommendedKva,
    voltageClassRecommendation,
    substationType,
    primaryCurrentAmps13_8kV
  };
}

export interface QuoteFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  voltageRating?: string;
  powerKva?: string;
  location?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateQuoteForm(form: QuoteFormState): ValidationResult {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim().length < 3) {
    errors.name = 'Nome completo é obrigatório (mínimo 3 caracteres)';
  }

  if (!form.company || form.company.trim().length < 2) {
    errors.company = 'Nome da empresa ou razão social é obrigatório';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email.trim())) {
    errors.email = 'Informe um endereço de e-mail corporativo válido';
  }

  const cleanPhone = (form.phone || '').replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    errors.phone = 'Informe um telefone com DDD válido (mínimo 10 dígitos)';
  }

  if (!form.serviceType || form.serviceType.trim() === '') {
    errors.serviceType = 'Selecione o tipo de serviço técnico desejado';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateQuoteProtocol(prefix = 'OMG'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${randomSuffix}`;
}

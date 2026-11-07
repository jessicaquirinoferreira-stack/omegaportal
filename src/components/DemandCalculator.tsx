import React, { useState, useMemo } from 'react';
import { Calculator, Zap, ArrowRight, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { calculateTransformerDemand, DemandCalculationResult } from '../utils/engineering';

interface DemandCalculatorProps {
  onCarryToQuote: (calculatedKva: number, substationType: string) => void;
}

export const DemandCalculator: React.FC<DemandCalculatorProps> = ({ onCarryToQuote }) => {
  const [activePowerKw, setActivePowerKw] = useState<number>(650);
  const [powerFactor, setPowerFactor] = useState<number>(0.92);
  const [diversityFactor, setDiversityFactor] = useState<number>(0.80);
  const [growthMarginPct, setGrowthMarginPct] = useState<number>(20);

  const result: DemandCalculationResult = useMemo(() => {
    return calculateTransformerDemand({
      activePowerKw: Number(activePowerKw) || 10,
      powerFactor: Number(powerFactor) || 0.92,
      diversityFactor: Number(diversityFactor) || 0.8,
      growthMarginPct: Number(growthMarginPct) || 0,
    });
  }, [activePowerKw, powerFactor, diversityFactor, growthMarginPct]);

  return (
    <section id="calculadora" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#996515] dark:text-[#C9A227] mb-3">
            <span>04. Ferramenta de Engenharia</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
            <span>Pré-Dimensionamento de Transformador</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-4">
            Calculadora Técnica de Demanda e Subestação.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Estime a potência aparente (kVA), a potência padronizada do transformador segundo as normas ABNT NBR 5440/5356 e o tipo ideal de cabine ou subestação para a sua carga industrial.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Input Controls */}
          <div className="lg:col-span-6 p-7 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-[#996515] dark:text-[#C9A227] flex items-center gap-1.5 font-bold">
                  <Cpu className="w-4 h-4" />
                  Parâmetros de Carga da Planta
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  ABNT NBR 14039 & 5410
                </span>
              </div>

              {/* Slider 1: Active Power kW */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="activePower" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Potência Ativa Instalada Total (kW)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                    {activePowerKw} kW
                  </span>
                </div>
                <input
                  id="activePower"
                  type="range"
                  min="50"
                  max="10000"
                  step="25"
                  value={activePowerKw}
                  onChange={(e) => setActivePowerKw(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#996515] dark:accent-[#C9A227]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>50 kW (Comércio/Pequena)</span>
                  <span>2.500 kW</span>
                  <span>10.000 kW (Pesada)</span>
                </div>
              </div>

              {/* Slider 2: Power Factor (cos phi) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="powerFactor" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Fator de Potência Desejado (cos φ)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                    {powerFactor.toFixed(2)}
                  </span>
                </div>
                <input
                  id="powerFactor"
                  type="range"
                  min="0.80"
                  max="1.00"
                  step="0.01"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#996515] dark:accent-[#C9A227]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0.80 (Indutivo baixo)</span>
                  <span className="text-[#996515] dark:text-[#C9A227] font-semibold">0.92 (Mínimo Regulatório ANEEL)</span>
                  <span>1.00 (Unitário)</span>
                </div>
              </div>

              {/* Slider 3: Diversity Factor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="diversityFactor" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Fator de Demanda / Simultaneidade (Fd)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                    {(diversityFactor * 100).toFixed(0)}% ({diversityFactor.toFixed(2)})
                  </span>
                </div>
                <input
                  id="diversityFactor"
                  type="range"
                  min="0.40"
                  max="1.00"
                  step="0.05"
                  value={diversityFactor}
                  onChange={(e) => setDiversityFactor(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#996515] dark:accent-[#C9A227]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>40% (Cargas alternadas)</span>
                  <span>80% (Média industrial)</span>
                  <span>100% (Contínua plena)</span>
                </div>
              </div>

              {/* Slider 4: Expansion Margin */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="growthMargin" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Margem para Expansão Futura de Cargas (%)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                    +{growthMarginPct}%
                  </span>
                </div>
                <input
                  id="growthMargin"
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={growthMarginPct}
                  onChange={(e) => setGrowthMarginPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#996515] dark:accent-[#C9A227]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0% (Sem reserva)</span>
                  <span>20% (Recomendado)</span>
                  <span>50% (Plano de expansão)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Cálculo baseado em: <span className="font-mono text-slate-800 dark:text-slate-300">S (kVA) = (P_kW × Fd × (1 + Margem)) / FP</span>
            </div>
          </div>

          {/* Right Column: Calculated Results & Substation Recommendation */}
          <div className="lg:col-span-6 p-7 sm:p-8 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#0A3D4A]/40 border border-slate-200 dark:border-[#C9A227]/40 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#0A3D4A] dark:text-[#C9A227] flex items-center gap-1.5 font-bold">
                  <Zap className="w-4 h-4" />
                  Dimensionamento Preliminar de Engenharia
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  Estimativa Técnica
                </span>
              </div>

              {/* Big Metrics Display */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Demanda Aparente Calculada</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 dark:text-white tabular-nums">
                      {result.apparentPowerKva.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">kVA</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-950/90 border border-amber-200 dark:border-[#C9A227]/60">
                  <span className="text-xs text-[#996515] dark:text-[#C9A227] block mb-1 font-semibold">Transformador Padronizado</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#996515] dark:text-[#C9A227] tabular-nums">
                      {result.recommendedKva.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs font-mono text-[#996515] dark:text-[#C9A227] font-bold">kVA</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Output */}
              <div className="space-y-3.5 mb-8">
                <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Topologia de Entrada Recomendada:</span>
                  <span className="font-bold text-slate-950 dark:text-white text-sm">{result.substationType}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5">Classe de Tensão da Concessionária:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{result.voltageClassRecommendation}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Corrente Primária Nominal Estimada (13,8 kV):</span>
                  <span className="font-mono font-bold text-[#996515] dark:text-[#C9A227]">{result.primaryCurrentAmps13_8kV} A</span>
                </div>
              </div>
            </div>

            {/* Carry to Quote CTA Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onCarryToQuote(result.recommendedKva, result.substationType)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] shadow-md transition-all cursor-pointer"
              >
                <span>Importar estes dados para Orçamento Técnico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
                Preenche automaticamente a potência e o escopo no formulário de cotação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

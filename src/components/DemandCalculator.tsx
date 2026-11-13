import React, { useState, useMemo } from 'react';
import { Zap, ArrowRight, Cpu } from 'lucide-react';
import { calculateTransformerDemand, DemandCalculationResult } from '../utils/engineering';
import { ArchitecturalBrackets, EditorialReveal } from './ui/IndustrialEffects';

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
    <section
      id="calculadora"
      className="cv-auto py-20 lg:py-28 bg-white dark:bg-[#060E14] border-b border-slate-200 dark:border-slate-800/90 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <EditorialReveal className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#996515] dark:text-[#C9A227] font-bold mb-3">
            <span>05 · Ferramenta de Engenharia</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Pré-Dimensionamento de Transformador</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-4 leading-[1.08]">
            Calculadora técnica de demanda e subestação.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Estime a potência aparente (kVA), o transformador padronizado segundo as normas ABNT NBR 5440/5356 e a topologia ideal de cabine ou subestação para a sua carga industrial.
          </p>
        </EditorialReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-xl bg-[#F6F8FA] dark:bg-[#08131A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-[#996515] dark:text-[#C9A227] flex items-center gap-1.5 font-bold">
                  <Cpu className="w-4 h-4" />
                  Parâmetros de Carga da Planta
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  ABNT NBR 14039 & 5410
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="activePower" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Potência Ativa Instalada Total (kW)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
                    {activePowerKw.toLocaleString('pt-BR')} kW
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
                  className="omega-slider w-full bg-slate-200 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>50 kW</span>
                  <span>2.500 kW</span>
                  <span>10.000 kW</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="powerFactor" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Fator de Potência Desejado (cos φ)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
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
                  className="omega-slider w-full bg-slate-200 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>0.80</span>
                  <span className="text-[#996515] dark:text-[#C9A227] font-semibold">
                    0.92 (Mínimo ANEEL)
                  </span>
                  <span>1.00</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="diversityFactor" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Fator de Demanda / Simultaneidade (Fd)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
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
                  className="omega-slider w-full bg-slate-200 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>40% (Alternadas)</span>
                  <span>80% (Média industrial)</span>
                  <span>100% (Contínua)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="growthMargin" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Margem para Expansão Futura (%)
                  </label>
                  <span className="text-sm font-mono font-bold text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
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
                  className="omega-slider w-full bg-slate-200 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>0% (Sem reserva)</span>
                  <span>20% (Recomendado)</span>
                  <span>50% (Expansão)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Equação: <span className="font-mono text-slate-800 dark:text-slate-200">S (kVA) = (P_kW × Fd × (1 + Margem)) / FP</span>
            </div>
          </div>

          {/* Right Column: Engineering Readout */}
          <div className="relative lg:col-span-6 p-6 sm:p-8 rounded-xl bg-[#071E26] border border-[#195363] text-white flex flex-col justify-between">
            <ArchitecturalBrackets colorClass="border-[#C9A227]/55" sizeClass="w-3 h-3" />
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5 font-bold">
                  <Zap className="w-4 h-4" />
                  Dimensionamento Preliminar
                </span>
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                  Estimativa Técnica
                </span>
              </div>

              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="p-3.5 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 block mb-1">Demanda Aparente</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
                      {result.apparentPowerKva.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">kVA</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/50">
                  <span className="text-xs text-[#F5E6B3] block mb-1 font-semibold">
                    Transformador Padrão
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-3xl font-extrabold font-mono text-[#C9A227] tabular-nums">
                      {result.recommendedKva.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs font-mono text-[#C9A227] font-bold">kVA</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10 mb-8 text-xs">
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400">Topologia Recomendada:</span>
                  <span className="font-bold text-white sm:text-right">{result.substationType}</span>
                </div>
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400">Classe de Tensão Concessionária:</span>
                  <span className="font-semibold text-slate-200 sm:text-right">
                    {result.voltageClassRecommendation}
                  </span>
                </div>
                <div className="py-3.5 flex items-center justify-between gap-2">
                  <span className="text-slate-400">Corrente Primária Nominal (13,8 kV):</span>
                  <span className="font-mono font-bold text-[#C9A227] tabular-nums">
                    {result.primaryCurrentAmps13_8kV} A
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => onCarryToQuote(result.recommendedKva, result.substationType)}
                className="btn-metallic-sheen w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-xs font-bold uppercase tracking-[0.08em] text-slate-950 bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] transition-colors cursor-pointer"
              >
                <span>Importar para Orçamento Técnico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2.5">
                Transfere automaticamente a potência padronizada e topologia para a proposta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

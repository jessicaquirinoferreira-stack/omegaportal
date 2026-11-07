import React from 'react';
import { ShieldCheck, Award, Compass } from 'lucide-react';
import { COMPANY_TIMELINE } from '../data/companyData';
import { SpotlightCard, Magnetic } from './ui/ModernEffects';

interface CompanySectionProps {
  onNavigate: (sectionId: string) => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ onNavigate }) => {
  return (
    <section
      id="empresa"
      className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#996515] dark:text-[#C9A227] font-bold mb-3">
            <span>01. Institucional</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              /
            </span>
            <span>A Empresa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-5">
            Mais de duas décadas construindo a infraestrutura elétrica de grandes indústrias.
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            A{' '}
            <strong className="text-slate-950 dark:text-white font-bold">
              Omega Engenharia e Construções Elétricas
            </strong>{' '}
            é uma empresa 100% nacional formada por engenheiros e técnicos com mais de 25 anos de
            experiência comprovada no setor elétrico (Geração, Transmissão e Distribuição). Com
            aproximadamente{' '}
            <strong className="text-slate-950 dark:text-white font-bold">
              200.000 kVA instalados
            </strong>
            , atuamos com rigor técnico em todo o ciclo: desde a concepção do projeto, trâmites de
            aprovação na concessionária e montagem civil-eletromecânica até o comissionamento e a
            ligação final das cabines.
          </p>
        </div>

        {/* 3 Core Value Pillars with SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <SpotlightCard
            spotlightColor="rgba(10, 61, 74, 0.12)"
            className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 hover:border-[#0A3D4A]/60 dark:hover:border-[#C9A227]/50 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#0A3D4A] dark:bg-[#0A3D4A]/60 dark:border-[#C9A227]/30 dark:text-[#C9A227] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white mb-2">
                Nossa Missão
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Fornecer engenharia elétrica e infraestrutura de alta potência que garanta a máxima
                continuidade operacional e segurança patrimonial dos nossos clientes, através de
                soluções eletromecânicas precisas e duradouras.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(201, 162, 39, 0.14)"
            className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 hover:border-[#996515]/60 dark:hover:border-[#C9A227]/50 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#0A3D4A] dark:bg-[#0A3D4A]/60 dark:border-[#C9A227]/30 dark:text-[#C9A227] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white mb-2">
                Nossa Visão
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Consolidar-se como a principal referência independente do setor elétrico paulista e
                nacional em montagens de subestações até 500 kV e cabines primárias, reconhecida
                pela velocidade de homologação e excelência executiva.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(10, 61, 74, 0.12)"
            className="p-7 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 hover:border-[#0A3D4A]/60 dark:hover:border-[#C9A227]/50 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#0A3D4A] dark:bg-[#0A3D4A]/60 dark:border-[#C9A227]/30 dark:text-[#C9A227] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white mb-2">
                Nossos Valores
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Rigor normativo absoluto (ABNT e NRs), compromisso inegociável com a integridade
                física de nossos operadores e parceiros, transparência orçamentária e pontualidade
                na energização das instalações.
              </p>
            </div>
          </SpotlightCard>
        </div>

        {/* Trajectory & End-to-End Scope Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* Left Column: Scope Cycle */}
          <SpotlightCard
            spotlightColor="rgba(10, 61, 74, 0.10)"
            className="lg:col-span-5 p-8 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#996515] dark:text-[#C9A227] tracking-wider font-bold">
                Ciclo Completo de Atuação
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-950 dark:text-white mt-2 mb-4">
                Da concepção à energização definitiva
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-medium">
                Nossos clientes não precisam contratar múltiplos fornecedores. A Omega assume a
                responsabilidade total do projeto elétrico perante os órgãos reguladores e
                concessionárias:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-[#0A3D4A] dark:bg-[#0A3D4A] dark:border-[#C9A227] dark:text-[#C9A227] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Estudo de Viabilidade & Projeto Executivo
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Dimensionamento de demanda, estudos de curto-circuito e fluxo de carga.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-[#0A3D4A] dark:bg-[#0A3D4A] dark:border-[#C9A227] dark:text-[#C9A227] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Aprovação nas Concessionárias
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Tramitação técnica junto à Enel, CPFL, CTEEP, EDP, Cemig com ART registrada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-[#0A3D4A] dark:bg-[#0A3D4A] dark:border-[#C9A227] dark:text-[#C9A227] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Montagem Eletromecânica & Civil
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Construção física de bases, cubículos, barramentos de cobre e cabeamento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-[#0A3D4A] dark:bg-[#0A3D4A] dark:border-[#C9A227] dark:text-[#C9A227] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Comissionamento & Energização Final
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Testes de relés, ensaios de isolamento e ligação oficial à rede de alta
                      tensão.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
              <Magnetic strength={0.12} className="w-full">
                <button
                  onClick={() => onNavigate('orcamento')}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0A3D4A] hover:bg-[#082f39] dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] dark:text-slate-950 shadow-md transition-colors cursor-pointer text-center"
                >
                  Consulte Nossa Equipe de Engenharia
                </button>
              </Magnetic>
            </div>
          </SpotlightCard>

          {/* Right Column: Timeline */}
          <SpotlightCard
            spotlightColor="rgba(201, 162, 39, 0.12)"
            className="lg:col-span-7 p-8 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div>
              <span className="text-xs font-mono uppercase text-[#996515] dark:text-[#C9A227] tracking-wider font-bold">
                Marcos & Trajetória
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-950 dark:text-white mt-2 mb-6">
                Construção de um legado técnico no setor elétrico
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {COMPANY_TIMELINE.map((item) => (
                  <div key={item.title} className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-teal-100 border-2 border-[#996515] dark:bg-[#0A3D4A] dark:border-[#C9A227]" />
                    <span className="text-xs font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                      {item.year}
                    </span>
                    <h4 className="text-base font-bold text-slate-950 dark:text-white mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical differential badge row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="block text-xs font-bold text-slate-950 dark:text-white">
                  NR-10 & SEP
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  100% Certificados
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="block text-xs font-bold text-slate-950 dark:text-white">
                  CREA / SP
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Registro Ativo
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="block text-xs font-bold text-slate-950 dark:text-white">
                  200k kVA
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Total Instalado
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <span className="block text-xs font-bold text-slate-950 dark:text-white">
                  500 kV
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Classe Máxima
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

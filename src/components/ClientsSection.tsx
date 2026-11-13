import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Building2,
  ArrowUpRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ArchitecturalBrackets, EditorialReveal, TiltSpotlightCard } from './ui/IndustrialEffects';

export interface ClientCase {
  id: string;
  name: string;
  subtitle?: string;
  initials: string;
  location: string;
  scope: string;
  category: 'Subestações' | 'Cabines Primárias' | 'Bus Way & Industrial' | 'Infraestrutura & Redes';
  powerRating: string;
  voltageClass: string;
  tags: string[];
  highlight?: boolean;
}

const CLIENT_CASES: ClientCase[] = [
  {
    id: 'hypermarcas',
    name: 'Hypermarcas',
    subtitle: 'Hypera Pharma',
    initials: 'HYP',
    location: 'Guarulhos / SP',
    scope: 'Subestação 15 MVA, Distribuição Industrial, Grupo Gerador, SPDA e Automação completa.',
    category: 'Subestações',
    powerRating: '15 MVA',
    voltageClass: '69 / 13,8 kV',
    tags: ['Subestação 15 MVA', 'Grupo Gerador', 'SPDA', 'Automação'],
    highlight: true,
  },
  {
    id: 'mendes-junior',
    name: 'Mendes Junior – Metrô SP',
    subtitle: 'Infraestrutura Metroviária',
    initials: 'MJR',
    location: 'São Paulo / SP',
    scope: 'Execução e comissionamento de Cabines Primárias de alta confiabilidade para malha metroviária.',
    category: 'Cabines Primárias',
    powerRating: 'Alta Confiabilidade',
    voltageClass: '15 – 34,5 kV',
    tags: ['Cabines Primárias', 'Metrô SP', 'Média Tensão'],
    highlight: true,
  },
  {
    id: 'continental',
    name: 'Continental Pneus',
    subtitle: 'Indústria Automotiva',
    initials: 'CON',
    location: 'São Bernardo do Campo / SP',
    scope: 'Instalação e Manutenção especializada de linhas Bus Way blindadas e Transformadores de potência.',
    category: 'Bus Way & Industrial',
    powerRating: 'Alta Capacidade',
    voltageClass: '13,8 / 34,5 kV',
    tags: ['Bus Way', 'Transformadores', 'Manutenção Industrial'],
    highlight: true,
  },
  {
    id: 'acument',
    name: 'Acument Elementos de Fixação',
    subtitle: 'Acument Global Technologies',
    initials: 'ACU',
    location: 'Atibaia / SP',
    scope: 'Construção de Subestação 5 MVA e malha completa de Distribuição Elétrica Industrial.',
    category: 'Subestações',
    powerRating: '5 MVA',
    voltageClass: '34,5 / 13,8 kV',
    tags: ['Subestação 5 MVA', 'Distribuição Industrial', 'Comissionamento'],
    highlight: true,
  },
  {
    id: 'fixopar',
    name: 'Fixopar Parafusos',
    subtitle: 'Metalurgia & Fixadores',
    initials: 'FIX',
    location: 'São Paulo / SP',
    scope: 'Projeto, montagem eletromecânica e ligação de Cabines Primárias totalizando 4 MVA de potência.',
    category: 'Cabines Primárias',
    powerRating: '4 MVA',
    voltageClass: '15 kV',
    tags: ['Cabines Primárias', '4 MVA', 'Média Tensão'],
  },
  {
    id: 'alarmtek',
    name: 'AlarmTek Sistemas de Controles',
    subtitle: 'Subestações CTEEP',
    initials: 'ATK',
    location: 'Alphaville / SP',
    scope: 'Instalação e Manutenção especializada em Subestações de transmissão da CTEEP até 500 kV.',
    category: 'Subestações',
    powerRating: 'Transmissão CTEEP',
    voltageClass: 'Até 500 kV',
    tags: ['Subestações CTEEP', 'Alta Tensão', 'Manutenção'],
  },
  {
    id: 'arcelormittal',
    name: 'ArcelorMittal Aços',
    subtitle: 'Siderurgia Global',
    initials: 'ARM',
    location: 'Guarulhos / SP',
    scope: 'Instalação eletromecânica e manutenção preventiva/corretiva de barramentos blindados Bus Way.',
    category: 'Bus Way & Industrial',
    powerRating: 'Siderurgia Pesada',
    voltageClass: 'Média / Baixa Tensão',
    tags: ['Bus Way', 'Siderurgia', 'Manutenção'],
    highlight: true,
  },
  {
    id: 'ericsson',
    name: 'Ericsson Sistemas de Comunicação',
    subtitle: 'Telecomunicações & Tecnologia',
    initials: 'ERI',
    location: 'São Paulo / SP',
    scope: 'Montagem eletromecânica e adequação normativa de Cabines Primárias de média tensão.',
    category: 'Cabines Primárias',
    powerRating: 'Missão Crítica',
    voltageClass: '15 – 23 kV',
    tags: ['Cabines Primárias', 'Telecom', 'Montagem Elétrica'],
  },
  {
    id: 'filoauto',
    name: 'Filoauto Auto Partes',
    subtitle: 'Setor Automotivo',
    initials: 'FIL',
    location: 'Indaiatuba / SP',
    scope: 'Implantação integrada de barramentos Bus Way, Cabines Primárias e sistema SPDA estrutural.',
    category: 'Bus Way & Industrial',
    powerRating: 'Planta Industrial',
    voltageClass: '15 / 34,5 kV',
    tags: ['Bus Way', 'Cabines Primárias', 'SPDA'],
  },
  {
    id: 'fm-rodrigues',
    name: 'FM Rodrigues Eletrificação',
    subtitle: 'Infraestrutura Elétrica',
    initials: 'FMR',
    location: 'São Paulo / SP',
    scope: 'Manutenção técnica, ensaios físico-químicos, tratamento termo-vácuo e comissionamento de Transformadores.',
    category: 'Subestações',
    powerRating: 'Transformadores',
    voltageClass: '15 – 69 kV',
    tags: ['Transformadores', 'Manutenção Preditiva', 'Ensaios'],
  },
  {
    id: 'pom-pom',
    name: 'Pom Pom Fraldas',
    subtitle: 'Bens de Consumo / Higiene',
    initials: 'POM',
    location: 'Guarulhos / SP',
    scope: 'Construção, montagem e comissionamento de Cabines Primárias com capacidade instalada de 5 MVA.',
    category: 'Cabines Primárias',
    powerRating: '5 MVA',
    voltageClass: '15 kV',
    tags: ['Cabines Primárias', '5 MVA', 'Indústria'],
  },
  {
    id: 'peguform',
    name: 'Peguform Auto Partes',
    subtitle: 'Componentes Automotivos',
    initials: 'PEG',
    location: 'Curitiba / PR',
    scope: 'Desenvolvimento de Projetos Executivos e Instalações Elétricas Industriais de grande porte.',
    category: 'Bus Way & Industrial',
    powerRating: 'Planta Completa',
    voltageClass: '13,8 kV / 380V',
    tags: ['Projetos Elétricos', 'Instalações Industriais', 'Automotivo'],
  },
  {
    id: 'tyco-adt',
    name: 'Tyco / ADT',
    subtitle: 'Segurança & Monitoramento',
    initials: 'ADT',
    location: 'São José dos Campos / SP',
    scope: 'Projeto luminotécnico executivo e implantação de Iluminação Industrial de alta eficiência.',
    category: 'Bus Way & Industrial',
    powerRating: 'Luminotécnica',
    voltageClass: 'Industrial BT/MT',
    tags: ['Iluminação Industrial', 'Projeto Executivo', 'Eficiência'],
  },
  {
    id: 'unilever',
    name: 'Unilever',
    subtitle: 'Multinacional Bens de Consumo',
    initials: 'UNI',
    location: 'Vinhedo / SP',
    scope: 'Construção e remodelação de Rede Aérea de Distribuição Primária e Secundária no complexo industrial.',
    category: 'Infraestrutura & Redes',
    powerRating: 'Rede Primária/Sec.',
    voltageClass: '13,8 kV / BT',
    tags: ['Rede Aérea Primária', 'Rede Secundária', 'Distribuição'],
    highlight: true,
  },
  {
    id: 'tekma',
    name: 'Tekma Construtora',
    subtitle: 'Engenharia Civil & Corporativa',
    initials: 'TEK',
    location: 'Brasília / DF',
    scope: 'Instalação Elétrica completa de média e baixa tensão em Empreendimentos e Prédios Comerciais.',
    category: 'Infraestrutura & Redes',
    powerRating: 'Corporativo',
    voltageClass: 'Média / Baixa Tensão',
    tags: ['Prédios Comerciais', 'Instalações Elétricas', 'Quadros Gerais'],
  },
  {
    id: 'zanardi',
    name: 'Zanardi Empreendimentos',
    subtitle: 'Urbanismo & Loteamentos',
    initials: 'ZAN',
    location: 'Bragança Paulista / SP',
    scope: 'Infraestrutura completa de Eletrificação de Loteamentos, redes de distribuição e iluminação viária.',
    category: 'Infraestrutura & Redes',
    powerRating: 'Redes Urbanas',
    voltageClass: '13,8 / 34,5 kV',
    tags: ['Eletrificação de Loteamentos', 'Redes Aéreas', 'Concessionária'],
  },
];

const CATEGORIES = [
  'Todos',
  'Subestações',
  'Cabines Primárias',
  'Bus Way & Industrial',
  'Infraestrutura & Redes',
] as const;

interface ClientCardProps {
  client: ClientCase;
  index: number;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, index }) => {
  const numCode = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <TiltSpotlightCard
        maxTiltDeg={2.2}
        spotlightColor="rgba(201, 162, 39, 0.12)"
        className="h-full rounded-xl bg-white dark:bg-[#08131A] border border-slate-200 dark:border-slate-800/90 hover:border-[#0A3D4A] dark:hover:border-[#C9A227]/80 p-6"
      >
        {/* Subtle Monogram Architectural Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-3 right-3 font-display text-7xl font-black tracking-tighter text-slate-900/[0.035] dark:text-white/[0.04] transition-transform duration-500 group-hover/tilt:scale-105"
        >
          {client.initials}
        </div>

        {/* Top Spec Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="min-w-0">
              <span className="block text-[10px] font-mono uppercase tracking-[0.14em] text-[#996515] dark:text-[#C9A227] font-bold">
                CASE {numCode} · {client.powerRating}
              </span>
              <span className="block text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                {client.voltageClass}
              </span>
            </div>

            {/* Clean Bespoke Architectural Seal */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-[#0D202A] border border-slate-200 dark:border-[#1B4A5B] group-hover/tilt:border-[#996515] dark:group-hover/tilt:border-[#C9A227] transition-colors">
              <span className="font-mono text-[11px] font-extrabold tracking-tight text-[#0A3D4A] dark:text-[#C9A227]">
                {client.initials}
              </span>
            </div>
          </div>

          {/* Client Name & Location */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
              <MapPin className="h-3 w-3 text-[#996515] dark:text-[#C9A227] shrink-0" />
              <span>{client.location}</span>
            </div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-950 dark:text-white group-hover/tilt:text-[#0A3D4A] dark:group-hover/tilt:text-[#F5E6B3] transition-colors">
              {client.name}
            </h3>
            {client.subtitle && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {client.subtitle}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-5">
            {client.scope}
          </p>
        </div>

        {/* Footer Metadata */}
        <div className="relative z-10 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
            {client.tags.slice(0, 2).join(' · ')}
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 shrink-0">
            Comissionada
          </span>
        </div>
      </TiltSpotlightCard>
    </motion.div>
  );
};

interface ClientsSectionProps {
  isDark?: boolean;
  onNavigateToQuote?: () => void;
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({ onNavigateToQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    return CLIENT_CASES.filter((client) => {
      const matchesCategory =
        selectedCategory === 'Todos' || client.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="clientes"
      className="cv-auto relative py-20 lg:py-28 bg-[#F6F8FA] dark:bg-[#04090D] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <EditorialReveal className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#996515] dark:text-[#C9A227] font-bold mb-3">
              <span>04 · Portfólio Corporativo</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
              <span>Cases Reais</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-[1.08] text-slate-950 dark:text-white">
              Empresas líderes que confiam na{' '}
              <span className="text-[#0A3D4A] dark:text-[#C9A227]">Omega Engenharia</span>.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              Mais de <strong className="font-semibold text-slate-950 dark:text-white">200.000 kVA instalados</strong> em plantas industriais, subestações até 500 kV, cabines primárias e infraestrutura crítica em todo o Brasil.
            </p>
          </EditorialReveal>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 shrink-0 border-t pt-5 lg:border-t-0 lg:pt-0 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-6">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
                16+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Grandes Cases
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#996515] dark:text-[#C9A227] tabular-nums">
                200 MVA
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Potência Entregue
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 dark:text-white tabular-nums">
                500 kV
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Classe Máxima
              </div>
            </div>
          </div>
        </div>

        {/* Hairline Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-10">
          <div className="flex items-center gap-5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`relative pb-1.5 text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0A3D4A] dark:text-[#C9A227]'
                      : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {category}
                  {isActive && (
                    <motion.span
                      layoutId="clientes-tab-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-0 -bottom-1 h-[2px] bg-[#0A3D4A] dark:bg-[#C9A227]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, cidade ou escopo..."
              aria-label="Buscar cliente, cidade ou escopo"
              className="w-full rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#091820] border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0A3D4A] dark:focus:border-[#C9A227]"
            />
          </div>
        </div>

        {/* 16 Clients Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client, index) => (
              <ClientCard key={client.id} client={client} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16 rounded-xl bg-white dark:bg-[#091820] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <Building2 className="h-9 w-9 mx-auto mb-3 text-[#C9A227]" />
            <p className="text-base font-semibold">Nenhum case encontrado para o filtro selecionado.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A3D4A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D4F5F] cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Bottom CTA Strip */}
        <div className="relative mt-14 rounded-xl bg-[#071E26] border border-[#1E5666] p-7 sm:p-9 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <ArchitecturalBrackets colorClass="border-[#C9A227]/50" sizeClass="w-3 h-3" />
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#C9A227]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Precisa de engenharia elétrica de alta confiabilidade para sua planta?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Atuamos desde o projeto executivo e aprovação na concessionária até o comissionamento final até 500 kV.
              </p>
            </div>
          </div>

          <a
            href="#orcamento"
            onClick={(e) => {
              if (onNavigateToQuote) {
                e.preventDefault();
                onNavigateToQuote();
              }
            }}
            className="btn-metallic-sheen shrink-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-950 transition-colors cursor-pointer"
          >
            <span>Solicitar Estudo Técnico</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;

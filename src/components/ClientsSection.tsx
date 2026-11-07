import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Zap,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Search,
  CheckCircle2,
} from 'lucide-react';

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
  logo: string;
  fallbackLogo?: string;
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
    logo: 'https://logo.clearbit.com/hypera.com.br',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hypermarcas.svg/640px-Hypermarcas.svg.png',
    tags: ['Subestação 15 MVA', 'Grupo Gerador', 'SPDA', 'Automação'],
    highlight: true,
  },
  {
    id: 'mendes-junior',
    name: 'Mendes Junior – Metrô SP',
    subtitle: 'Infraestrutura Metroviária',
    initials: 'MJ',
    location: 'São Paulo / SP',
    scope: 'Execução e comissionamento de Cabines Primárias de alta confiabilidade para malha metroviária.',
    category: 'Cabines Primárias',
    powerRating: 'Alta Confiabilidade',
    voltageClass: '15 – 34,5 kV',
    logo: 'https://logo.clearbit.com/mendesjunior.com.br',
    fallbackLogo: 'https://seeklogo.com/images/M/mendes-junior-logo-272921.png',
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
    logo: 'https://logo.clearbit.com/continental.com',
    fallbackLogo: 'https://logo.clearbit.com/continental-tires.com',
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
    logo: 'https://logo.clearbit.com/acument.com',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=acument.com&sz=256',
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
    logo: 'https://logo.clearbit.com/fixopar.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=fixopar.com.br&sz=256',
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
    logo: 'https://logo.clearbit.com/alarmtek.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=alarmtek.com.br&sz=256',
    tags: ['Subestações CTEEP', 'Alta Tensão', 'Manutenção'],
  },
  {
    id: 'arcelormittal',
    name: 'ArcelorMittal Aços',
    subtitle: 'Siderurgia Global',
    initials: 'AM',
    location: 'Guarulhos / SP',
    scope: 'Instalação eletromecânica e manutenção preventiva/corretiva de barramentos blindados Bus Way.',
    category: 'Bus Way & Industrial',
    powerRating: 'Siderurgia Pesada',
    voltageClass: 'Média / Baixa Tensão',
    logo: 'https://logo.clearbit.com/arcelormittal.com',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/ArcelorMittal.svg/640px-ArcelorMittal.svg.png',
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
    logo: 'https://logo.clearbit.com/ericsson.com',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ericsson_%282018%29.svg/512px-Ericsson_%282018%29.svg.png',
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
    logo: 'https://logo.clearbit.com/filoauto.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=filoauto.com.br&sz=256',
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
    logo: 'https://logo.clearbit.com/fmrodrigues.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=fmrodrigues.com.br&sz=256',
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
    logo: 'https://logo.clearbit.com/pompom.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=pompom.com.br&sz=256',
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
    logo: 'https://logo.clearbit.com/peguform.com',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=peguform.com&sz=256',
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
    logo: 'https://logo.clearbit.com/adt.com',
    fallbackLogo: 'https://logo.clearbit.com/tyco.com',
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
    logo: 'https://logo.clearbit.com/unilever.com',
    fallbackLogo: 'https://logo.clearbit.com/unilever.com.br',
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
    logo: 'https://logo.clearbit.com/tekma.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=tekma.com.br&sz=256',
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
    logo: 'https://logo.clearbit.com/zanardi.com.br',
    fallbackLogo: 'https://www.google.com/s2/favicons?domain=zanardi.com.br&sz=256',
    tags: ['Eletrificação de Loteamentos', 'Redes Aéreas', 'Aprovação Concessionária'],
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
  const [imgStage, setImgStage] = useState<'primary' | 'fallback' | 'placeholder'>('primary');

  const activeLogoUrl =
    imgStage === 'primary'
      ? client.logo
      : imgStage === 'fallback' && client.fallbackLogo
      ? client.fallbackLogo
      : null;

  const handleImageError = () => {
    if (imgStage === 'primary' && client.fallbackLogo) {
      setImgStage('fallback');
    } else {
      setImgStage('placeholder');
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.35), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#071E26] border border-[#143D4B] p-6 sm:p-7 text-white shadow-[0_10px_30px_-10px_rgba(7,30,38,0.35)] transition-all duration-500 hover:border-[#C9A227]/70 hover:shadow-[0_22px_50px_-12px_rgba(10,61,74,0.65),0_0_28px_rgba(201,162,39,0.22)] backdrop-blur-md"
    >
      {/* Hidden preloader img to trigger onError fallback reliably */}
      {activeLogoUrl && (
        <img
          src={activeLogoUrl}
          alt=""
          aria-hidden="true"
          onError={handleImageError}
          className="hidden"
        />
      )}

      {/* Subtle architectural grid & radial ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 85%, rgba(201, 162, 39, 0.18), transparent 60%), radial-gradient(circle at 15% 15%, rgba(13, 79, 95, 0.4), transparent 55%)',
        }}
      />

      {/* Top Energy Line Glow Micro-interaction */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-[#C9A227]/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Watermark Logo Background Layer (Bottom-Right with generous padding & contain fit - High visibility) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {activeLogoUrl ? (
          <div
            className="absolute bottom-3 right-3 h-36 w-48 sm:h-40 sm:w-56 p-5 transition-all duration-500 ease-out opacity-[0.38] group-hover:opacity-[0.70] group-hover:scale-105"
            style={{
              backgroundImage: `url("${activeLogoUrl}")`,
              backgroundSize: 'contain',
              backgroundPosition: 'bottom right',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(2.2) contrast(1.25) drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
            }}
          />
        ) : (
          /* Elegant Initials Watermark Placeholder when external logo is unreachable */
          <div className="absolute -bottom-3 right-3 flex items-end justify-end p-4 select-none transition-all duration-500 ease-out opacity-[0.20] group-hover:opacity-[0.35] group-hover:scale-105">
            <span className="font-mono text-7xl sm:text-8xl font-black tracking-tighter text-white/90">
              {client.initials}
            </span>
          </div>
        )}
      </div>

      {/* Semi-transparent dark gradient overlay over watermark (lighter to let logos shine) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06181F]/80 via-[#071E26]/60 to-[#071E26]/40 transition-opacity duration-500 group-hover:from-[#06181F]/70 group-hover:via-[#071E26]/50 group-hover:to-[#071E26]/30" />

      {/* Card Top Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Category & Voltage Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0D4F5F]/80 border border-[#1E6A7D] px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-[#E2F1F5]">
              <Zap className="h-3 w-3 text-[#C9A227] transition-transform duration-300 group-hover:scale-125" />
              {client.powerRating}
            </span>
            <span className="inline-flex items-center rounded-md bg-white/10 border border-white/20 px-2 py-1 text-[11px] font-mono text-slate-200">
              {client.voltageClass}
            </span>
          </div>

          {/* Mini Logo Badge / Verification Pill in Corner (Larger and highly visible) */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/30 p-2 backdrop-blur-md transition-all duration-300 group-hover:border-[#C9A227] group-hover:bg-white/25 shadow-md">
            {activeLogoUrl ? (
              <img
                src={activeLogoUrl}
                alt={`Logo ${client.name}`}
                onError={handleImageError}
                className="h-full w-full object-contain filter brightness-200 contrast-125 opacity-100 transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <span className="font-mono text-xs font-bold tracking-tight text-[#C9A227]">
                {client.initials}
              </span>
            )}
          </div>
        </div>

        {/* Client Name & Location */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227] mb-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{client.location}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#F5E6B3] transition-colors">
            {client.name}
          </h3>
          {client.subtitle && (
            <p className="text-xs font-medium text-slate-400 mt-0.5">{client.subtitle}</p>
          )}
        </div>

        {/* Technical Scope Description */}
        <p className="text-sm leading-relaxed text-slate-200/95 mb-6 font-normal">
          {client.scope}
        </p>
      </div>

      {/* Card Footer: Tags & Energy Pulse Status */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {client.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-[#0A2E3A]/90 border border-[#195363]/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-200 transition-colors group-hover:border-[#C9A227]/40 group-hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            OBRA ENTREGUE & COMISSIONADA
          </span>
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C9A227]" />
        </div>
      </div>
    </motion.article>
  );
};

interface ClientsSectionProps {
  isDark?: boolean;
  onNavigateToQuote?: () => void;
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({ isDark = false }) => {
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
      className={`relative py-24 sm:py-32 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#05141A] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Subtle architectural background lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(10,61,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,61,74,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0A3D4A]/10 dark:bg-[#0A3D4A]/40 border border-[#0A3D4A]/20 px-3.5 py-1.5 mb-4">
              <ShieldCheck className="h-4 w-4 text-[#996515] dark:text-[#C9A227]" />
              <span
                className={`text-xs font-mono uppercase tracking-widest font-semibold ${
                  isDark ? 'text-[#C9A227]' : 'text-[#0A3D4A]'
                }`}
              >
                Portfólio de Engenharia & Cases Reais
              </span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              Empresas líderes que confiam na{' '}
              <span className="text-[#0A3D4A] dark:text-[#C9A227] underline decoration-[#C9A227]/60 decoration-2 underline-offset-8">
                Omega Engenharia
              </span>
            </h2>

            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Mais de <strong className="font-semibold">200.000 kVA instalados</strong> em plantas
              industriais, subestações até 500 kV, cabines primárias e infraestrutura crítica em
              todo o Brasil.
            </p>
          </div>

          {/* Impact Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div
              className={`rounded-xl border p-4 ${
                isDark
                  ? 'bg-[#071E26] border-[#143D4B]'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0A3D4A] dark:text-[#C9A227]">
                16+
              </div>
              <div
                className={`text-xs font-medium mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Grandes Cases
              </div>
            </div>
            <div
              className={`rounded-xl border p-4 ${
                isDark
                  ? 'bg-[#071E26] border-[#143D4B]'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#996515] dark:text-[#C9A227]">
                200 MVA
              </div>
              <div
                className={`text-xs font-medium mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Potência Instalada
              </div>
            </div>
            <div
              className={`rounded-xl border p-4 ${
                isDark
                  ? 'bg-[#071E26] border-[#143D4B]'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0A3D4A] dark:text-[#C9A227]">
                500 kV
              </div>
              <div
                className={`text-xs font-medium mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Classe de Tensão
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A3D4A] text-white shadow-md shadow-[#0A3D4A]/25 border border-[#C9A227]/50'
                      : isDark
                      ? 'bg-[#071E26] text-slate-300 border border-[#143D4B] hover:border-[#C9A227]/40 hover:text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0A3D4A]/40 hover:text-[#0A3D4A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, cidade ou escopo..."
              aria-label="Buscar cliente, cidade ou escopo"
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border transition-all focus:outline-none ${
                isDark
                  ? 'bg-[#071E26] border-[#143D4B] text-white placeholder-slate-400 focus:border-[#C9A227]'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-[#0A3D4A]'
              }`}
            />
          </div>
        </div>

        {/* 16 Clients Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client, index) => (
              <ClientCard key={client.id} client={client} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredClients.length === 0 && (
          <div
            className={`text-center py-16 rounded-2xl border ${
              isDark
                ? 'bg-[#071E26]/60 border-[#143D4B] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="h-10 w-10 mx-auto mb-3 text-[#C9A227]" />
            <p className="text-lg font-semibold">Nenhum case encontrado para o filtro selecionado.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A3D4A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D4F5F]"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#071E26] via-[#0A3D4A] to-[#071E26] border border-[#1E5666] p-8 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Precisa de engenharia elétrica de alta confiabilidade para sua planta?
              </h3>
              <p className="text-slate-200 text-sm sm:text-base mt-1">
                Nossa equipe atua desde o projeto executivo e aprovação na concessionária até o
                comissionamento final até 500 kV.
              </p>
            </div>
          </div>

          <a
            href="#orcamento"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] hover:bg-[#d8b132] px-6 py-3.5 text-sm font-bold text-[#071E26] shadow-lg shadow-[#C9A227]/20 transition-all hover:scale-105"
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

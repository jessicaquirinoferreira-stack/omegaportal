export type PartId =
  | 'tank'
  | 'tankCover'
  | 'bushingsHV'
  | 'bushingsMV'
  | 'radiators'
  | 'conservator'
  | 'insulation'
  | 'windingsHV'
  | 'windingsLV'
  | 'core'
  | 'kiosk';

export interface PartTechnicalInfo {
  id: PartId;
  name: string;
  tag: string;
  category: 'Estrutura & Tanque' | 'Alta / Média Tensão' | 'Refrigeração & Óleo' | 'Parte Ativa' | 'Isolamento & Comando';
  norm: string;
  functionText: string;
  importanceText: string;
  locationText: string;
  relationshipsText: string;
  illustrativeNote: string;
  focusTarget: [number, number, number];
  focusOffset: [number, number, number];
}

export interface DisassemblyPhaseInfo {
  phase: number;
  title: string;
  subtitle: string;
  range: [number, number];
}

export interface CameraPreset {
  id: 'iso' | 'front' | 'side' | 'top' | 'rear' | 'internal' | 'exploded';
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  minExplode?: number;
}

export const DISASSEMBLY_PHASES: DisassemblyPhaseInfo[] = [
  {
    phase: 1,
    title: 'Fase 1 — Equipamento Completo',
    subtitle: 'Transformador trifásico imerso em óleo totalmente montado em condição operacional.',
    range: [0, 0.08],
  },
  {
    phase: 2,
    title: 'Fase 2 — Componentes Externos',
    subtitle: 'Separação das buchas de 500 kV / MT, conservador de óleo, relé Buchholz e radiadores.',
    range: [0.08, 0.32],
  },
  {
    phase: 3,
    title: 'Fase 3 — Tanque e Tampa Superior',
    subtitle: 'Elevação da tampa principal e recuo organizado do tanque de aço estrutural.',
    range: [0.32, 0.54],
  },
  {
    phase: 4,
    title: 'Fase 4 — Isolamento & Enrolamentos',
    subtitle: 'Exposição das barreiras de papelão prensado, espaçadores de canais de óleo e bobinas de cobre.',
    range: [0.54, 0.78],
  },
  {
    phase: 5,
    title: 'Fase 5 — Núcleo Magnético Laminado',
    subtitle: 'Visualização das lâminas de aço silício GO, colunas trifásicas e culatras com juntas a 45°.',
    range: [0.78, 0.92],
  },
  {
    phase: 6,
    title: 'Fase 6 — Visualização Completa',
    subtitle: 'Composição tridimensional explodida preservando o eixo e a hierarquia de montagem.',
    range: [0.92, 1.0],
  },
];

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'iso',
    label: 'Isométrica',
    position: [6.8, 4.4, 7.6],
    target: [0, 1.55, 0],
  },
  {
    id: 'front',
    label: 'Frontal',
    position: [0, 2.3, 8.8],
    target: [0, 1.5, 0],
  },
  {
    id: 'side',
    label: 'Lateral',
    position: [9.0, 2.4, 0.2],
    target: [0, 1.45, 0],
  },
  {
    id: 'top',
    label: 'Superior',
    position: [0.1, 10.2, 2.6],
    target: [0, 1.2, 0],
  },
  {
    id: 'rear',
    label: 'Traseira',
    position: [0, 2.4, -9.0],
    target: [0, 1.45, 0],
  },
  {
    id: 'internal',
    label: 'Interna',
    position: [2.6, 1.95, 3.8],
    target: [0, 1.22, 0.3],
    minExplode: 0.7,
  },
  {
    id: 'exploded',
    label: 'Explodida',
    position: [9.2, 5.4, 10.4],
    target: [0, 1.95, 0],
    minExplode: 1.0,
  },
];

export const TRANSFORMER_PARTS_CATALOG: Record<PartId, PartTechnicalInfo> = {
  tank: {
    id: 'tank',
    name: 'Tanque Principal em Aço Estrutural',
    tag: 'TK-01',
    category: 'Estrutura & Tanque',
    norm: 'ABNT NBR 5356-1 / IEC 60076-1',
    functionText:
      'Invólucro metálico estanque que acondiciona a parte ativa (núcleo e enrolamentos) e o volume principal de óleo mineral isolante sob vácuo ou pressão positiva.',
    importanceText:
      'Garante estanqueidade absoluta contra umidade atmosférica, suporta esforços mecânicos de curto-circuito e contém o fluido dielétrico e térmico.',
    locationText: 'Corpo central apoiado sobre chassi metálico e bacia de contenção na base da subestação.',
    relationshipsText:
      'Acopla-se diretamente aos radiadores laterais via válvulas de bloqueio, sustenta a tampa superior aparafusada e conecta-se à malha de aterramento.',
    illustrativeNote:
      'Geometria ilustrativa de referência industrial (nervuras de reforço, escotilhas, válvulas e placa de identificação).',
    focusTarget: [0, 1.2, 0],
    focusOffset: [4.8, 2.6, 5.2],
  },
  tankCover: {
    id: 'tankCover',
    name: 'Tampa Principal Flangeada',
    tag: 'TMP-01',
    category: 'Estrutura & Tanque',
    norm: 'ABNT NBR 5356-1',
    functionText:
      'Fecha hermeticamente o topo do tanque principal com junta de vedação periférica e parafusos de aperto calibrado, servindo de base estrutural para buchas e acessórios.',
    importanceText:
      'Permite o acesso controlado à parte ativa durante inspeções ou reformas e suporta as torres das buchas de alta e média tensão.',
    locationText: 'Topo do tanque principal, entre o corpo do tanque e as bases das buchas.',
    relationshipsText:
      'Fixada ao flange superior do tanque; suporta as torres das buchas AT/MT, válvula de alívio de pressão e tubulação ascendente para o conservador.',
    illustrativeNote: 'Configuração visual de referência com parafusos perimetrais e olhais de içamento.',
    focusTarget: [0, 2.35, 0],
    focusOffset: [4.2, 2.4, 4.2],
  },
  bushingsHV: {
    id: 'bushingsHV',
    name: 'Buchas Condensivas de Alta Tensão',
    tag: 'BCH-AT',
    category: 'Alta / Média Tensão',
    norm: 'IEC 60137 / ABNT NBR 5034',
    functionText:
      'Conduzem os condutores de alta tensão (referência cadastrada até 500 kV) através da tampa aterrada do tanque mantendo isolação elétrica e gradiente capacitivo controlado.',
    importanceText:
      'As saias alternadas de porcelana esmaltada aumentam a distância de escoamento superficial, prevenindo descargas externas sob chuva ou poluição.',
    locationText: 'Montadas sobre torres elevadoras no lado de Alta Tensão da tampa superior.',
    relationshipsText:
      'Conectam os terminais de saída dos enrolamentos de alta tensão ao barramento aéreo da subestação através dos conectores NEMA e centelhadores.',
    illustrativeNote: 'Perfil de saias em porcelana e centelhadores modelados em padrão visual de referência.',
    focusTarget: [0, 3.2, 0.55],
    focusOffset: [3.2, 1.9, 3.6],
  },
  bushingsMV: {
    id: 'bushingsMV',
    name: 'Buchas de Baixa / Média Tensão',
    tag: 'BCH-MT',
    category: 'Alta / Média Tensão',
    norm: 'ABNT NBR 5356 / NBR 5034',
    functionText:
      'Promovem a saída isolada das fases secundárias e do condutor neutro aterrável para o barramento de média tensão ou cabine primária.',
    importanceText:
      'Asseguram baixa resistência de contato nos terminais em liga de cobre/latão e vedação estanque contra penetração de umidade no óleo.',
    locationText: 'Lado oposto às buchas de alta tensão sobre a tampa do tanque.',
    relationshipsText:
      'Recebem os barramentos ascendentes provenientes dos enrolamentos secundários e conectam-se aos cabos ou barramentos blindados de saída.',
    illustrativeNote: 'Arranjo ilustrativo trifásico + neutro (4 buchas) sobre a tampa superior.',
    focusTarget: [0, 2.8, -0.58],
    focusOffset: [2.8, 1.5, -3.2],
  },
  radiators: {
    id: 'radiators',
    name: 'Bancos de Radiadores (Sistema ONAN)',
    tag: 'RAD-ONAN',
    category: 'Refrigeração & Óleo',
    norm: 'ABNT NBR 5356-2',
    functionText:
      'Dissipam para o ambiente o calor gerado pelas perdas no núcleo e nos enrolamentos por convecção natural do óleo isolante e do ar externo (ONAN).',
    importanceText:
      'Mantêm a elevação de temperatura dentro do limite indicado (65 °C), preservando a vida útil do isolamento celulósico e evitando degradação térmica do óleo.',
    locationText: 'Flancos esquerdo e direito do tanque principal, acoplados por coletores superiores e inferiores.',
    relationshipsText:
      'Recebem óleo quente do topo do tanque pelo coletor superior, resfriam através das aletas estampadas e retornam o óleo mais denso pela base.',
    illustrativeNote:
      'Aletas individuais estampadas com válvulas borboleta e coletores em configuração ilustrativa ONAN.',
    focusTarget: [1.85, 1.25, 0],
    focusOffset: [3.6, 1.4, 3.4],
  },
  conservator: {
    id: 'conservator',
    name: 'Tanque Conservador, Relé Buchholz & Auxiliares',
    tag: 'CNS-BHZ',
    category: 'Refrigeração & Óleo',
    norm: 'ABNT NBR 5356 / NBR 5440',
    functionText:
      'Absorve a variação volumétrica do óleo causada pelo aquecimento em carga, reduzindo a área de contato com o ar; integra o relé Buchholz e o secador de sílica gel.',
    importanceText:
      'O relé Buchholz detecta acúmulo lento de gases ou surtos bruscos de fluxo de óleo provocados por faltas internas, enviando sinal de alarme e desligamento.',
    locationText: 'Suspenso por cavaletes metálicos acima da tampa principal do tanque.',
    relationshipsText:
      'Liga-se ao tanque principal por tubulação inclinada onde se instala o relé Buchholz, além de alimentar o visor magnético de nível e o respirador desumidificador.',
    illustrativeNote: 'Conjunto auxiliar ilustrativo com indicador de nível, secador de sílica e relé Buchholz.',
    focusTarget: [-0.8, 3.3, -0.3],
    focusOffset: [-3.2, 1.6, 3.6],
  },
  insulation: {
    id: 'insulation',
    name: 'Sistema Interno de Isolamento Dielétrico',
    tag: 'ISO-INT',
    category: 'Isolamento & Comando',
    norm: 'IEC 60641 / ABNT NBR 5356-3',
    functionText:
      'Composto por cilindros e barreiras de papelão prensado (pressboard), anéis de aperto e réguas espaçadoras que estruturam os canais de circulação do óleo.',
    importanceText:
      'Garante rigidez dielétrica entre fases, entre enrolamentos AT/BT e contra o núcleo aterrado, além de canalizar o fluxo convectivo de óleo para resfriamento.',
    locationText: 'Intercalado radial e axialmente entre o núcleo, os enrolamentos secundários e os enrolamentos primários.',
    relationshipsText:
      'Envolve as bobinas de cobre e mantém o espaçamento dielétrico e mecânico preciso sob esforços eletrodinâmicos de curto-circuito.',
    illustrativeNote: 'Representação visual de barreiras cilíndricas, barreiras entre fases e espaçadores radiais.',
    focusTarget: [0, 1.25, 0],
    focusOffset: [2.8, 1.2, 2.8],
  },
  windingsHV: {
    id: 'windingsHV',
    name: 'Enrolamentos Primários de Alta Tensão (Cobre)',
    tag: 'BOB-AT',
    category: 'Parte Ativa',
    norm: 'ABNT NBR 5356-1 / NBR 5356-5',
    functionText:
      'Bobinas concêntricas externas em condutores de cobre eletrolítico isolados com papel termoestabilizado, dispostas em discos contínuos com anéis equalizadores de campo.',
    importanceText:
      'Estabelecem a relação de transformação nominal e suportam impulsos atmosféricos e manobras de rede com distribuição uniforme de gradiente elétrico.',
    locationText: 'Camada concêntrica externa ao redor dos enrolamentos de baixa/média tensão nas três colunas.',
    relationshipsText:
      'Conectam-se eletricamente às buchas de alta tensão e ao comutador de derivações; isolam-se das bobinas internas por cilindros de pressboard e dutos de óleo.',
    illustrativeNote: 'Discos múltiplos de cobre com espaçadores radiais e anéis eletrostáticos de referência.',
    focusTarget: [0, 1.25, 0],
    focusOffset: [2.7, 1.1, 2.8],
  },
  windingsLV: {
    id: 'windingsLV',
    name: 'Enrolamentos Secundários (Cobre Eletrolítico)',
    tag: 'BOB-MT',
    category: 'Parte Ativa',
    norm: 'ABNT NBR 5356-1 / NBR 5356-5',
    functionText:
      'Bobinas helicoidais internas posicionadas diretamente ao redor das colunas do núcleo magnético, otimizadas para conduzir maiores correntes com baixas perdas ôhmicas.',
    importanceText:
      'Transferem a potência elétrica para o lado secundário com mínima reatância de dispersão e elevada robustez mecânica axial.',
    locationText: 'Camada concêntrica interna ao redor de cada uma das três colunas do núcleo magnético.',
    relationshipsText:
      'Acoplam-se magneticamente às colunas do núcleo e indutivamente aos enrolamentos primários externos; seus terminais sobem às buchas secundárias.',
    illustrativeNote: 'Enrolamento helicoidal interno em cobre com dutos axiais ilustrativos.',
    focusTarget: [0, 1.2, 0],
    focusOffset: [2.4, 1.0, 2.5],
  },
  core: {
    id: 'core',
    name: 'Núcleo Magnético em Aço-Silício Laminado',
    tag: 'NUC-GO',
    category: 'Parte Ativa',
    norm: 'ABNT NBR 5356 / IEC 60404',
    functionText:
      'Circuito magnético trifásico de três colunas e duas culatras construído com pacotes empilhados de lâminas finas de aço-silício de grão orientado (GO) com juntas em ângulo (step-lap).',
    importanceText:
      'A laminação isolada reduz drasticamente as perdas por correntes parasitas (Foucault) e histerese, concentrando o fluxo magnético mútuo entre os enrolamentos.',
    locationText: 'Centro estrutural da parte ativa, atravessando axialmente as três bobinas concêntricas.',
    relationshipsText:
      'Sustentado por vigas de prensagem (clamping frames) e tirantes isolados; aterrado em ponto único ao tanque para evitar potenciais flutuantes.',
    illustrativeNote: 'Pacotes escalonados com representação visual de lâminas individuais e vigas de aperto.',
    focusTarget: [0, 1.2, 0],
    focusOffset: [2.3, 0.9, 2.4],
  },
  kiosk: {
    id: 'kiosk',
    name: 'Armário de Comando & Monitoramento Local',
    tag: 'PNL-MK',
    category: 'Isolamento & Comando',
    norm: 'NBR IEC 60529 / NR-10',
    functionText:
      'Centraliza bornes dos transformadores de corrente (TCs), contatos do relé Buchholz, indicadores de temperatura de óleo/enrolamento (OTI/WTI) e circuitos de alarme.',
    importanceText:
      'Integra a proteção intrínseca do transformador ao painel de proteção e controle (PAC) / sistema SCADA da subestação.',
    locationText: 'Fixado na face frontal do tanque principal em altura ergonômica de inspeção.',
    relationshipsText:
      'Recebe eletrodutos blindados dos sensores do conservador, tampa e buchas, interligando-os à sala de comando da subestação.',
    illustrativeNote: 'Painel IP65 ilustrativo com mostradores térmicos e sinóptico de supervisão.',
    focusTarget: [0, 1.0, 1.18],
    focusOffset: [1.8, 0.7, 2.4],
  },
};

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/**
 * Smooth cubic-in-out curve over a normalized sub-interval [start, end]
 */
export function subPhaseEase(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  const t = clamp01((progress - start) / (end - start));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function getActiveDisassemblyPhase(progress: number): DisassemblyPhaseInfo {
  const p = clamp01(progress);
  for (const phase of DISASSEMBLY_PHASES) {
    if (p >= phase.range[0] && p <= phase.range[1]) {
      return phase;
    }
  }
  return DISASSEMBLY_PHASES[0];
}

export interface ComponentOffsets {
  bushingsHV: [number, number, number];
  bushingsMV: [number, number, number];
  conservator: [number, number, number];
  radiatorsLeft: [number, number, number];
  radiatorsRight: [number, number, number];
  kiosk: [number, number, number];
  tankCover: [number, number, number];
  tankBody: [number, number, number];
  insulation: [number, number, number];
  windingsHV: [number, number, number];
  windingsLV: [number, number, number];
  core: [number, number, number];
}

/**
 * Deterministic, collision-free, strictly reversible 6-phase exploded view coordinates.
 * At progress = 0, ALL vectors are exact [0, 0, 0].
 * Components separate cleanly along logical assembly axes without intersecting each other.
 */
export function computeExplodedOffsets(progress: number): ComponentOffsets {
  const p = clamp01(progress);

  // Phase 2 (0.08 -> 0.35): External components lift/retract along assembly axes
  const tExt = subPhaseEase(p, 0.06, 0.36);
  // Phase 3 (0.30 -> 0.58): Cover lifts above tank, tank body retracts back cleanly
  const tCover = subPhaseEase(p, 0.28, 0.52);
  const tTank = subPhaseEase(p, 0.36, 0.62);
  // Phase 4 (0.55 -> 0.82): Insulation & concentric copper windings slide forward/apart cleanly
  const tInsul = subPhaseEase(p, 0.54, 0.78);
  const tWindHV = subPhaseEase(p, 0.60, 0.86);
  const tWindLV = subPhaseEase(p, 0.70, 0.94);
  // Phase 5 (0.80 -> 1.00): Core remains centered / slightly elevated for 360 close-up
  const tCore = subPhaseEase(p, 0.78, 1.0);

  const z = (v: number) => (v === 0 ? 0 : v);

  return {
    // HV Bushings lift straight up along Y + slightly forward Z
    bushingsHV: [0, z(tExt * 1.45 + tCover * 0.35), z(tExt * 0.45)],
    // MV Bushings lift up along Y + slightly backward Z
    bushingsMV: [0, z(tExt * 1.35 + tCover * 0.35), z(-tExt * 0.45)],
    // Conservator lifts higher & slightly left so it never collides with bushings
    conservator: [z(-tExt * 0.7), z(tExt * 1.25 + tCover * 0.35), z(-tExt * 0.35)],
    // Radiator banks slide straight outward along -X / +X
    radiatorsLeft: [z(-tExt * 1.85), 0, 0],
    radiatorsRight: [z(tExt * 1.85), 0, 0],
    // Front marshaling kiosk slides forward cleanly
    kiosk: [0, 0, z(tExt * 1.45 + tTank * 0.4)],
    // Tank cover rises smoothly above the windings/bushings clearance
    tankCover: [0, z(tCover * 1.35), 0],
    // Main tank housing slides cleanly backward along -Z, revealing the active part completely unobstructed
    tankBody: [0, 0, z(-tTank * 3.15)],
    // Pressboard insulation barriers lift slightly and offset right-forward so copper coils stay 100% visible
    insulation: [z(-tInsul * 1.15), z(tInsul * 0.45), z(tInsul * 1.45)],
    // Outer HV copper disc windings slide forward cleanly ahead of LV
    windingsHV: [0, z(tWindHV * 0.15), z(tWindHV * 1.15)],
    // Inner LV copper helical windings step out halfway between core and HV
    windingsLV: [0, z(tWindLV * 0.08), z(tWindLV * 0.55)],
    // Core rises gently off the base plinth in final phase for full bottom-yoke inspection
    core: [0, z(tCore * 0.24), z(-tCore * 0.18)],
  };
}

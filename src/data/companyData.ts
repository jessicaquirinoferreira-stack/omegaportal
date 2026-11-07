import imgCabinesPrimarias from '../assets/images/services/01-cabines-primarias.webp';
import imgSubestacoes from '../assets/images/services/02-subestacoes.jpg';
import imgInstalacoesIndustriais from '../assets/images/services/03-instalacoes-industriais.jpg';
import imgBusWay from '../assets/images/services/04-bus-way.jpg';
import imgTransformadores from '../assets/images/services/05-transformadores.webp';
import imgManutencao from '../assets/images/services/06-manutencao-subestacoes.jpg';
import imgSpda from '../assets/images/services/07-spda-aterramento.webp';
import imgPaineis from '../assets/images/services/08-paineis-eletricos.jpg';
import imgEletrificacao from '../assets/images/services/09-eletrificacao-loteamentos.jpg';
import imgIluminacao from '../assets/images/services/10-iluminacao-industrial.jpg';
import imgLocacaoGeradores from '../assets/images/services/11-locacao-equipamentos.jpg';
import imgPessoalTecnico from '../assets/images/services/12-pessoal-tecnico.webp';
import omegaLogoAsset from '../assets/images/logo-omega-metal-ouro.png';
import omegaLogoDarkAsset from '../assets/images/logo-omega-dark.png';

export const OMEGA_OFFICIAL_LOGO = 'https://i.postimg.cc/Gh9tKHJD/Logo-Omega-Engenharia-em-Metal-e-Ouro.png';
export const OMEGA_LOGO_SRC = omegaLogoAsset;
export const OMEGA_LOGO_DARK_SRC = omegaLogoDarkAsset;

export interface ClientProject {
  id: string;
  name: string;
  city: string;
  state: string;
  scope: string;
  category: 'Subestações' | 'Cabines Primárias' | 'Bus Way' | 'Instalações Industriais' | 'Eletrificação & Redes';
  capacity?: string;
  highlight?: boolean;
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  category: string;
  voltageRange: string;
  standard: string;
  fullDesc: string;
  features: string[];
  deliverables: string[];
  imageSrc?: string;
  imageFallback?: string;
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export const COMPANY_METRICS = [
  { label: 'Anos de Experiência', value: '25+', detail: 'No setor elétrico (GTD)' },
  { label: 'Potência Instalada', value: '200k', unit: 'kVA', detail: 'Em plantas e indústrias' },
  { label: 'Subestações até', value: '500', unit: 'kV', detail: 'Classes de alta e extra alta tensão' },
  { label: 'Cabines Primárias', value: '15-34,5', unit: 'kV', detail: 'Concepção à energização final' },
  { label: 'Grandes Clientes', value: '100%', detail: 'Projetos homologados em concessionárias' },
];

export const CLIENTS_DATA: ClientProject[] = [
  {
    id: 'hypermarcas',
    name: 'Hypermarcas',
    city: 'Guarulhos',
    state: 'SP',
    scope: 'Subestação 15 MVA, Distribuição Elétrica Industrial, Grupo Gerador, SPDA e Automação',
    category: 'Subestações',
    capacity: '15 MVA',
    highlight: true,
  },
  {
    id: 'acument',
    name: 'Acument Elementos de Fixação',
    city: 'Atibaia',
    state: 'SP',
    scope: 'Subestação 5 MVA + Distribuição Elétrica Industrial de Média e Baixa Tensão',
    category: 'Subestações',
    capacity: '5 MVA',
    highlight: true,
  },
  {
    id: 'fixopar',
    name: 'Fixopar Parafusos',
    city: 'São Paulo',
    state: 'SP',
    scope: 'Construção e comissionamento de Cabines Primárias totalizando 4 MVA',
    category: 'Cabines Primárias',
    capacity: '4 MVA',
    highlight: true,
  },
  {
    id: 'alarmtek',
    name: 'AlarmTek Sistemas de Controles',
    city: 'Alphaville',
    state: 'SP',
    scope: 'Instalação e Manutenção Especializada em Subestações da CTEEP',
    category: 'Subestações',
    capacity: 'Subestações CTEEP',
    highlight: false,
  },
  {
    id: 'arcelormittal',
    name: 'ArcelorMittal Aços',
    city: 'Guarulhos',
    state: 'SP',
    scope: 'Instalação e Manutenção de Barramentos Blindados (Bus Way) de alta capacidade',
    category: 'Bus Way',
    capacity: 'Média/Baixa Tensão',
    highlight: true,
  },
  {
    id: 'continental',
    name: 'Continental Pneus',
    city: 'São Bernardo do Campo',
    state: 'SP',
    scope: 'Instalação e Manutenção de Bus Way e Transformadores de Força Industriais',
    category: 'Bus Way',
    capacity: 'Industrial Pesada',
    highlight: true,
  },
  {
    id: 'ericsson',
    name: 'Ericsson Sistemas de Comunicação',
    city: 'São Paulo',
    state: 'SP',
    scope: 'Montagem eletromecânica de Cabines Primárias e painéis de proteção',
    category: 'Cabines Primárias',
    capacity: 'Telecom & Data',
    highlight: true,
  },
  {
    id: 'filoauto',
    name: 'Filoauto Auto Partes',
    city: 'Indaiatuba',
    state: 'SP',
    scope: 'Sistema de Bus Way, Cabines Primárias e Proteção contra Descargas Atmosféricas (SPDA)',
    category: 'Cabines Primárias',
    capacity: 'Industrial Automotivo',
    highlight: false,
  },
  {
    id: 'fm-rodrigues',
    name: 'FM Rodrigues Eletrificação',
    city: 'São Paulo',
    state: 'SP',
    scope: 'Manutenção preditiva, corretiva e regeneração de óleo em Transformadores',
    category: 'Subestações',
    capacity: 'Rede de Distribuição',
    highlight: false,
  },
  {
    id: 'pom-pom',
    name: 'Pom Pom Fraldas',
    city: 'Guarulhos',
    state: 'SP',
    scope: 'Construção e energização de Cabines Primárias total de 5 MVA',
    category: 'Cabines Primárias',
    capacity: '5 MVA',
    highlight: true,
  },
  {
    id: 'mendes-junior',
    name: 'Mendes Junior – Metrô SP',
    city: 'São Paulo',
    state: 'SP',
    scope: 'Montagem e adequação de Cabines Primárias para infraestrutura de transporte sobre trilhos',
    category: 'Cabines Primárias',
    capacity: 'Infraestrutura Pública Metrô',
    highlight: true,
  },
  {
    id: 'peguform',
    name: 'Peguform Auto Partes',
    city: 'Curitiba',
    state: 'PR',
    scope: 'Projetos de engenharia elétrica e montagem de instalações industriais completas',
    category: 'Instalações Industriais',
    capacity: 'Parque Fabril PR',
    highlight: false,
  },
  {
    id: 'tyco-adt',
    name: 'Tyco / ADT',
    city: 'São José dos Campos',
    state: 'SP',
    scope: 'Projeto luminotécnico e execução de Iluminação Industrial de alto rendimento',
    category: 'Instalações Industriais',
    capacity: 'Planta de Segurança',
    highlight: false,
  },
  {
    id: 'unilever',
    name: 'Unilever',
    city: 'Vinhedo',
    state: 'SP',
    scope: 'Implantação de Rede Aérea Primária e Secundária de distribuição industrial',
    category: 'Eletrificação & Redes',
    capacity: 'Rede Aérea MT/BT',
    highlight: true,
  },
  {
    id: 'tekma',
    name: 'Tekma Construtora',
    city: 'Brasília',
    state: 'DF',
    scope: 'Instalação elétrica corporativa e quadros de distribuição em Prédios Comerciais',
    category: 'Instalações Industriais',
    capacity: 'Complexo Corporativo',
    highlight: false,
  },
  {
    id: 'zanardi',
    name: 'Zanardi Empreendimentos',
    city: 'Bragança Paulista',
    state: 'SP',
    scope: 'Eletrificação completa de Loteamentos urbanos, redes de média e baixa tensão e iluminação pública',
    category: 'Eletrificação & Redes',
    capacity: 'Loteamento Residencial',
    highlight: false,
  },
];

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'cabines-primarias',
    title: 'Cabines Primárias',
    category: 'Média Tensão',
    voltageRange: '15 kV a 34,5 kV',
    standard: 'NBR 14039 / Concessionárias',
    shortDesc: 'Construção, montagem eletromecânica e energização completa de cabines primárias abrigadas, blindadas ou simplificadas.',
    fullDesc: 'Atuação integral desde o projeto elétrico e entrada de energia perante a concessionária (Enel, CPFL, EDP, etc.) até a montagem física, cubículos de medição e proteção, barramentos de cobre, chaves seccionadoras, disjuntores a vácuo/SF6 e comissionamento com emissão de ART.',
    features: [
      'Projetos aprovados nas principais concessionárias do Brasil',
      'Montagem de cubículos blindados e em alvenaria técnica',
      'Intertravamentos mecânicos de segurança Kirk e sistemas de relé digital',
      'Terminação muflas termocontrátil e testes de rigidez dielétrica',
    ],
    deliverables: [
      'Projeto Executivo Eletromecânico e Unifilar',
      'Laudo de Comissionamento e Ensaios de Isolamento',
      'Homologação e ART do CREA',
      'Treinamento e Instruções Operacionais NR-10',
    ],
    imageSrc: imgCabinesPrimarias,
    imageFallback: 'https://www.grupoecasi.com.br/galeria/cabines-primarias/01-1024.webp',
  },
  {
    id: 'subestacoes',
    title: 'Subestações até 500 kV',
    category: 'Alta Tensão',
    voltageRange: '69 kV a 500 kV',
    standard: 'NBR 5422 / ONS / NBR 5356',
    shortDesc: 'Implantação e manutenção de subestações transformadoras e seccionadoras para concessionárias e grandes indústrias.',
    fullDesc: 'Capacidade técnica comprovada em pátios de manobra de alta e extra alta tensão, montagem de pórticos metálicos, transformadores de potência, disjuntores de alta tensão, transformadores de corrente e potencial (TCs/TPs), malha de aterramento profunda e painéis de proteção e controle (PAC).',
    features: [
      'Experiência técnica em subestações operadas por CTEEP e grandes consumidores',
      'Montagem de bays de entrada de linha, acoplamento e transformação',
      'Sistemas de supervisão, telecontrole e automação SCADA',
      'Comissionamento completo de relés de proteção diferencial e sobrecorrente',
    ],
    deliverables: [
      'Memorial Descritivo e Diagramas Funcionais',
      'Relatório de Ensaios Eletromecânicos e Parametrização',
      'Termografia e Cromatografia Gasosa Inicial',
      'As-Built Completo e Homologação ONS/Concessionária',
    ],
    imageSrc: imgSubestacoes,
    imageFallback: 'https://gridmanutencao.com.br/images/gallery/galeria-subestacao-01.jpg',
  },
  {
    id: 'instalacoes-industriais',
    title: 'Instalações Industriais',
    category: 'Infraestrutura Fabril',
    voltageRange: 'Média e Baixa Tensão',
    standard: 'NBR 5410 / NR-10 / NR-12',
    shortDesc: 'Sistemas elétricos robustos para linhas de produção contínuas, plantas químicas, metalúrgicas e alimentícias.',
    fullDesc: 'Distribuição de força e comando para maquinários pesados, encaminhamento em eletrocalhas e leitos aramados de aço galvanizado a fogo, quadros gerais de baixa tensão (QGDFs), painéis de comando e banco de capacitores para correção do fator de potência.',
    features: [
      'Topologias elétricas projetadas para zero parada não planejada',
      'Sistemas de partida suave (Soft-Starters e Inversores de Frequência)',
      'Balanceamento de cargas e compensação reativa automática',
      'Adequação total à NR-10 e NR-12 com documentação técnica',
    ],
    deliverables: [
      'Diagramas Trifilares e Lista de Cargas',
      'Estudo de Curto-Circuito e Seletividade',
      'Prontuário das Instalações Elétricas (PIE)',
      'Medições de Resistência de Aterramento',
    ],
    imageSrc: imgInstalacoesIndustriais,
    imageFallback: 'https://gridmanutencao.com.br/images/gallery/galeria-manutencao-04.jpg',
  },
  {
    id: 'bus-way',
    title: 'Barramentos Blindados (Bus Way)',
    category: 'Distribuição Inteligente',
    voltageRange: 'Até 6.000 A (Cobre e Alumínio)',
    standard: 'NBR IEC 61439-6',
    shortDesc: 'Instalação e manutenção de sistemas de barramento blindado para distribuição eficiente de grandes correntes industriais.',
    fullDesc: 'Substituição vantajosa de feixes pesados de cabos por linhas compactas de Bus Way em plantas industriais e edifícios comerciais de grande porte (como ArcelorMittal, Continental Pneus e Filoauto). Maior segurança contra incêndio, menor queda de tensão e flexibilidade total para novas derivações de máquinas.',
    features: [
      'Condutores em cobre eletrolítico 99,9% ou liga de alumínio estanhado',
      'Caixas de derivação plug-in com disjuntores integrados para rápida expansão',
      'Ensaios de isolamento e torqueamento dinanométrico calibrado',
      'Manutenção preventiva com termografia periódica nas emendas',
    ],
    deliverables: [
      'Layout Isométrico da Linha de Barramento',
      'Relatório de Torqueamento com Ferramenta Certificada',
      'Ensaio de Isolação Megger (MΩ)',
      'Garantia de Estanqueidade e IP Certificado',
    ],
    imageSrc: imgBusWay,
    imageFallback: 'https://gridmanutencao.com.br/images/gallery/galeria-equipamento-01.jpg',
  },
  {
    id: 'transformadores',
    title: 'Transformadores de Força',
    category: 'Média e Alta Tensão',
    voltageRange: 'Até 500 kV / 150 MVA',
    standard: 'NBR 5356 / NBR 10576',
    shortDesc: 'Instalação, montagem, comissionamento, regeneração de óleo isolante e manutenção preditiva em transformadores.',
    fullDesc: 'Serviços completos em transformadores a seco (resina epóxi) e a óleo mineral ou vegetal. Inclui transporte técnico especializado, posicionamento sobre base com bacia de contenção, tratamento termovácuo de óleo no local, ensaios físico-químicos e cromatografia gasosa.',
    features: [
      'Ensaios de relação de transformação (TTR) e resistência de enrolamento',
      'Tratamento termovácuo para remoção de umidade e desgasificação',
      'Análise de gases dissolvidos (DGA) para prevenção de faltas internas',
      'Substituição de sílica gel, buchas de passagem e válvulas de alívio de pressão',
    ],
    deliverables: [
      'Certificado de Tratamento e Rigidez Dielétrica do Óleo',
      'Laudo Cromatográfico Completo com Curvas de Tendência',
      'Relatório de Resistência de Isolamento e Fator de Dissipação (Tan Delta)',
      'Plano de Manutenção Preventiva Programada',
    ],
    imageSrc: imgTransformadores,
    imageFallback: 'https://gridmanutencao.com.br/images/services/transformadores-forca-distribuicao.webp',
  },
  {
    id: 'manutencao-subestacoes',
    title: 'Manutenção Preditiva & Corretiva',
    category: 'Gestão de Ativos',
    voltageRange: 'MT e AT até 500 kV',
    standard: 'NBR 14039 / NBR 5410',
    shortDesc: 'Monitoramento contínuo, termografia com câmeras calibradas, ensaios dielétricos e atendimento a paradas programadas.',
    fullDesc: 'Planos de manutenção preditiva e preventiva sob medida para garantir 99.9% de disponibilidade operacional. Identificação de pontos quentes em barramentos e conexões antes da falha catastrófica, testes de atuação de disjuntores de média tensão e limpeza criogênica ou a seco.',
    features: [
      'Inspeções termográficas com laudo técnico e classificação de criticidade',
      'Limpeza de isoladores e reaperto com torquímetro digital aferido',
      'Testes de injeção de corrente primária e secundária em relés de proteção',
      'Plantão técnico e atendimento a emergências industriais',
    ],
    deliverables: [
      'Relatório Termográfico Fotográfico Norma ABNT',
      'Matriz de Risco e Cronograma de Intervenções Corretivas',
      'Certificados de Calibração dos Instrumentos Utilizados',
      'ART de Manutenção Especializada',
    ],
    imageSrc: imgManutencao,
    imageFallback: 'https://gridmanutencao.com.br/images/gallery/galeria-manutencao-01.jpg',
  },
  {
    id: 'spda-aterramento',
    title: 'SPDA e Aterramento Estrutural',
    category: 'Proteção & Segurança',
    voltageRange: 'Proteção Atmosférica',
    standard: 'ABNT NBR 5419 (Partes 1 a 4)',
    shortDesc: 'Projetos, laudos técnicos, instalação de para-raios tipo Franklin/Gaiola de Faraday e malhas de aterramento.',
    fullDesc: 'Proteção integral de edificações fabris e subestações contra descargas atmosféricas diretas e surtos eletromagnéticos induzidos. Gerenciamento de risco estruturado conforme a NBR 5419, instalação de DPS classes I, II e III e ensaios de continuidade elétrica de armaduras.',
    features: [
      'Cálculo de risco de acordo com a NBR 5419:2015',
      'Medição de resistividade do solo pelo método de Wenner (4 pontos)',
      'Medição de resistência de aterramento com terrômetro de alta frequência',
      'Inspeção detalhada de captores, descidas, juntas de dilatação e equalização',
    ],
    deliverables: [
      'Laudo Técnico Conclusivo de SPDA com ART',
      'Mapa de Malha de Aterramento e Pontos de Medição',
      'Relatório Fotográfico de Adequações Necessárias',
      'Certificado de Conformidade para Seguradoras e Corpo de Bombeiros (AVCB)',
    ],
    imageSrc: imgSpda,
    imageFallback: 'https://www.grupoecasi.com.br/galeria/spda/01-1024.webp',
  },
  {
    id: 'paineis-eletricos',
    title: 'Montagem de Painéis Elétricos',
    category: 'Automação & Força',
    voltageRange: 'Baixa e Média Tensão',
    standard: 'NBR IEC 61439-1/2',
    shortDesc: 'Projetos e montagem sob medida de CCMs (Centros de Controle de Motores), QGDFs e painéis de automação PLC.',
    fullDesc: 'Fabricação e montagem de cubículos com testes de tipo totalmente testados (TTA / PTTA), barramentos dimensionados para esforços de curto-circuito térmico e dinâmico, segregação interna formas 1 a 4b, e cabeamento com anilhas de identificação indeléveis.',
    features: [
      'Componentes das marcas líderes mundiais (ABB, Siemens, Schneider, WEG)',
      'Comunicação integrada via redes industriais (Profinet, Modbus, Ethernet/IP)',
      'Ensaios de rotina de tensão aplicada (hipot) e resistência de isolamento',
      'Projetos em conformidade com as normas NR-10 e NR-12',
    ],
    deliverables: [
      'Esquemas Elétricos Trifilares e de Comando em CAD/EPLAN',
      'Lista de Materiais e Folhas de Dados de Componentes',
      'Relatório de Teste de Fábrica (FAT)',
      'Manual de Operação e Manutenção do Painel',
    ],
    imageSrc: imgPaineis,
    imageFallback: 'https://images.pexels.com/photos/33706880/pexels-photo-33706880.jpeg',
  },
  {
    id: 'eletrificacao-loteamentos',
    title: 'Eletrificação de Loteamentos & Redes',
    category: 'Distribuição Urbana',
    voltageRange: 'Redes Aéreas e Subterrâneas',
    standard: 'Normas Técnicas das Concessionárias',
    shortDesc: 'Infraestrutura completa de redes aéreas compactas (Spacer Cable) e subterrâneas para loteamentos e condomínios.',
    fullDesc: 'Engenharia completa desde a aprovação do projeto executivo na concessionária distribuidora até a cravação de postes, lançamento de cabos protegidos, instalação de transformadores de distribuição em poste e iluminação pública viária em LED.',
    features: [
      'Redes compactas protegidas de média tensão (13,8 kV / 34,5 kV)',
      'Redes subterrâneas em PEAD com caixas de passagem e transformadores pedestal',
      'Iluminação viária e paisagística eficiente com telegestão',
      'Acompanhamento de fiscalização e energização com entrega final à concessionária',
    ],
    deliverables: [
      'Projeto Georreferenciado Aprovado na Concessionária',
      'Termo de Recebimento de Obra (TRO) emitido pela Distribuidora',
      'Cronograma Físico-Financeiro Executivo',
      'ART de Execução de Infraestrutura Elétrica',
    ],
    imageSrc: imgEletrificacao,
    imageFallback: 'https://images.pexels.com/photos/221047/pexels-photo-221047.jpeg',
  },
  {
    id: 'iluminacao-industrial',
    title: 'Iluminação Industrial & Retrofit LED',
    category: 'Eficiência Energética',
    voltageRange: 'Sistemas Industriais',
    standard: 'NBR ISO/CIE 8995-1',
    shortDesc: 'Estudos luminotécnicos com simulação Dialux, luminárias LED de alta eficiência e automação com sensores.',
    fullDesc: 'Projetos focados em conforto visual, índice de reprodução de cor (IRC) adequado para controle de qualidade fabril e redução drástica no consumo de quilowatt-hora (kWh) com amortização rápida de investimento.',
    features: [
      'Cálculo computacional de níveis de iluminância (Lux) por plano de trabalho',
      'Luminárias com grau de proteção IP66/IP69K para ambientes agressivos',
      'Sistemas com acionamento inteligente por setores e dimerização DALI',
      'Cases expressivos como o complexo da Tyco/ADT em São José dos Campos',
    ],
    deliverables: [
      'Relatório Luminotécnico 3D com Gráficos Isomórficos',
      'Estudo de Payback e Redução de Emissões de CO₂',
      'Diagrama Unifilar dos Circuitos de Iluminação',
      'Certificados de Garantia Estendida dos Equipamentos',
    ],
    imageSrc: imgIluminacao,
    imageFallback: 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg',
  },
  {
    id: 'locacao-equipamentos',
    title: 'Locação de Equipamentos e Geradores',
    category: 'Operações Temporárias',
    voltageRange: 'Grupos Moto Geradores e Cargas',
    standard: 'Normas ABNT / NBR',
    shortDesc: 'Locação de grupos geradores de energia silenciados, transformadores de manobra, bancos de carga e instrumentos.',
    fullDesc: 'Soluções rápidas para suporte a paradas programadas de manutenção, contingências elétricas ou picos sazonais de produção. Equipamentos revisados, modernos e acompanhados de operadores técnicos habilitados NR-10.',
    features: [
      'Grupos geradores cabinados silenciados de 50 a 1.500 kVA',
      'Quadros de transferência automática (QTA) microprocessados',
      'Cabos de força flexíveis de conexão rápida tipo Camlock',
      'Bancos de carga resistivo/indutivo para teste de geradores sob carga real',
    ],
    deliverables: [
      'Laudo de Teste em Carga Pré-Mobilização',
      'Logística e Instalação On-Site por Técnicos Qualificados',
      'Abastecimento e Monitoramento Contínuo',
      'Suporte Técnico de Plantão 24 Horas',
    ],
    imageSrc: imgLocacaoGeradores,
    imageFallback: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pessoal-tecnico',
    title: 'Fornecimento de Pessoal Técnico',
    category: 'Mão de Obra Qualificada',
    voltageRange: 'BT, MT e AT',
    standard: 'NR-10, NR-35, NR-12',
    shortDesc: 'Corpo técnico sênior dedicado: engenheiros eletricistas, técnicos em eletrotécnica e montadores especializados.',
    fullDesc: 'Disponibilização de equipes experientes para fiscalização de obras, comissionamento de plantas industriais, operação de cabines primárias e manobras em subestações. Todos os profissionais possuem certificações ativas de segurança do trabalho e EPIs calibrados.',
    features: [
      'Profissionais certificados em NR-10 (Básico e SEP - Sistema Elétrico de Potência)',
      'Habilitação em NR-35 (Trabalho em Altura) e NR-33 (Espaço Confinado)',
      'Gestão direta por engenheiro responsável com emissão de ART',
      'Flexibilidade de contratação por projeto, parada ou período contínuo',
    ],
    deliverables: [
      'Prontuário de Habilitação e Treinamentos dos Profissionais',
      'Ordem de Serviço de Segurança e Procedimento Operacional Padrão (POP)',
      'Relatórios Diários de Obra (RDO) Digitalizados',
      'Supervisão Técnica Periódica Especializada',
    ],
    imageSrc: imgPessoalTecnico,
    imageFallback: 'https://gridmanutencao.com.br/images/heroes/hero-home-tecnico.webp',
  },
];

export const COMPANY_TIMELINE: Milestone[] = [
  {
    year: 'Fundação',
    title: 'Nascimento da Omega Engenharia',
    desc: 'Constituída por engenheiros e especialistas técnicos com experiência prévia de mais de 25 anos nas concessionárias e grandes montagens eletromecânicas brasileiras.',
  },
  {
    year: 'Consolidação',
    title: 'Pioneirismo em Cabines Primárias Industriais',
    desc: 'Expansão acelerada com execução de grandes cabines primárias (Pom Pom 5 MVA, Fixopar 4 MVA e complexos fabris no polo industrial paulista).',
  },
  {
    year: 'Subestações de Grande Porte',
    title: 'Avanço até 500 kV e Parcerias Estratégicas',
    desc: 'Atuação em subestações da CTEEP e entrega da subestação de 15 MVA da Hypermarcas em Guarulhos, integrando automação e grupos geradores.',
  },
  {
    year: 'Infraestrutura Crítica',
    title: 'Projetos no Metrô SP e Líderes Globais',
    desc: 'Atendimento a empresas de engenharia pesada como Mendes Junior no Metrô de São Paulo, além de gigantes globais como Unilever, Ericsson e ArcelorMittal.',
  },
  {
    year: 'Presente',
    title: 'Marca de 200.000 kVA Instalados',
    desc: 'Consolidação de um portfólio robusto com soluções completas de engenharia elétrica de ponta a ponta, desde a concepção do projeto até a energização final.',
  },
];

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Zap,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronRight,
  ExternalLink,
  Bot,
  User,
  Instagram,
  RefreshCw,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import assistantAvatarImg from '../assets/images/assistente-virtual-avatar.jpg';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actionType?: 'whatsapp' | 'quote' | 'phone' | 'instagram' | 'none';
  actionLabel?: string;
  actionUrl?: string;
}

interface VirtualAssistantProps {
  onNavigateToQuote?: (serviceTitle?: string) => void;
  whatsAppNumber?: string;
  phoneNumber?: string;
  instagramUrl?: string;
}

const QUICK_PROMPTS = [
  'Como funciona a aprovação de Cabine Primária na concessionária?',
  'A Omega constrói subestações de até 500 kV?',
  'Quais as vantagens do Barramento Blindado (Bus Way)?',
  'Como agendar visita técnica ou solicitar orçamento?',
  'Quais normas técnicas (NBR/NR) a Omega atende?',
  'Qual o contato do WhatsApp de plantão da engenharia?',
];

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  onNavigateToQuote,
  whatsAppNumber = '5511987654321',
  phoneNumber = '(11) 3900-8800',
  instagramUrl = 'https://www.instagram.com/grupo_omega_construtora/',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const whatsAppBaseUrl = `https://wa.me/${whatsAppNumber}`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Olá! Sou a Engenheira Virtual da **Omega Engenharia e Construções Elétricas**.\n\nCom mais de **25 anos de experiência** e **200.000 kVA instalados**, estou aqui para esclarecer dúvidas sobre **Cabines Primárias**, **Subestações até 500 kV**, **Barramentos Blindados**, **Instalações Industriais** e **Normas ABNT**.',
      timestamp: 'Agora',
      actionType: 'whatsapp',
      actionLabel: '📲 Chamar Engenheiro no WhatsApp',
      actionUrl: `${whatsAppBaseUrl}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20t%C3%A9cnico%20da%20Omega%20Engenharia`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  // Comprehensive local engineering rule-base fallback
  const getLocalExpertReply = (query: string): { text: string; actionType: Message['actionType']; actionLabel: string; actionUrl: string } => {
    const q = query.toLowerCase();

    // 1. Cabines Primárias
    if (q.includes('cabine') || q.includes('primaria') || q.includes('primária') || q.includes('concessionaria') || q.includes('concessionária') || q.includes('enel') || q.includes('cpfl')) {
      return {
        text: 'A Omega é referência nacional em **Cabines Primárias de 15 kV a 34,5 kV** (abrigadas em alvenaria técnica, blindadas ou simplificadas).\n\n• **Atuação Completa:** Concepção do projeto executivo, entrada de energia perante a concessionária (Enel, CPFL, EDP, etc.), montagem civil-eletromecânica, cubículos de medição e proteção com disjuntores a vácuo/SF6 e comissionamento com emissão de ART.\n• **Normas:** ABNT NBR 14039 e regulamentações específicas de cada distribuidora.\n\nPodemos fazer o levantamento técnico do seu ramal de entrada.',
        actionType: 'whatsapp',
        actionLabel: '⚡ Orçar Cabine Primária no WhatsApp',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar sobre projeto/montagem de Cabine Primária na Omega Engenharia.')}`,
      };
    }

    // 2. Subestações
    if (q.includes('subestacao') || q.includes('subestação') || q.includes('subestações') || q.includes('500') || q.includes('alta tensao') || q.includes('alta tensão') || q.includes('ons')) {
      return {
        text: 'Executamos e comissionamos **Subestações Transformadoras e Seccionadoras de 69 kV a 500 kV** para concessionárias de transmissão (como CTEEP) e grandes complexos industriais.\n\n• **Escopo:** Montagem de pórticos metálicos, transformadores de força, disjuntores de alta tensão, TCs/TPs, malhas de aterramento profundas e sistemas de supervisão e telecontrole SCADA.\n• **Destaque:** Subestação industrial de 15 MVA entregue para a Hypermarcas em Guarulhos/SP.',
        actionType: 'whatsapp',
        actionLabel: '🏭 Falar sobre Subestação de Alta Tensão',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre a capacidade técnica da Omega em Subestações de Alta Tensão.')}`,
      };
    }

    // 3. Barramentos Blindados (Bus Way)
    if (q.includes('bus') || q.includes('way') || q.includes('barramento') || q.includes('barramentos')) {
      return {
        text: 'Os sistemas de **Barramentos Blindados (Bus Way)** da Omega atendem correntes de **até 6.000 A** em cobre eletrolítico ou alumínio estanhado (norma NBR IEC 61439-6).\n\n• **Vantagens:** Substituem feixes pesados de cabos, reduzem queda de tensão, oferecem proteção avançada contra incêndio e permitem caixas de derivação plug-in com disjuntores para ligar novas máquinas com zero interrupção fabril.\n• **Cases:** ArcelorMittal, Continental Pneus e Filoauto.',
        actionType: 'whatsapp',
        actionLabel: '⚡ Consultar Projeto de Bus Way',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar dimensionamento de Barramentos Blindados (Bus Way) com a Omega.')}`,
      };
    }

    // 4. Manutenção e Termografia
    if (q.includes('manuten') || q.includes('preditiva') || q.includes('termografia') || q.includes('laudo') || q.includes('art') || q.includes('ensaio')) {
      return {
        text: 'Nosso plano de **Manutenção Preditiva & Corretiva** foi desenvolvido para assegurar **99.9% de disponibilidade operacional** em indústrias contínuas.\n\n• **Serviços:** Inspeções termográficas com câmeras calibradas para detecção de pontos quentes, ensaios de isolamento (Megger), injeção de corrente secundária em relés de proteção e reaperto com torquímetro digital.\n• **Documentação:** Relatório fotográfico conforme norma ABNT com emissão de ART do CREA.',
        actionType: 'whatsapp',
        actionLabel: '📋 Agendar Inspeção Termográfica',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de agendar inspeção termográfica / manutenção preventiva com a Omega.')}`,
      };
    }

    // 5. SPDA e Aterramento
    if (q.includes('spda') || q.includes('aterramento') || q.includes('para-raio') || q.includes('para raio') || q.includes('faraday') || q.includes('franklin') || q.includes('avcb')) {
      return {
        text: 'Realizamos projetos, instalações e laudos de **SPDA e Aterramento Estrutural** em conformidade irrestrita com a **ABNT NBR 5419 (Partes 1 a 4)**.\n\n• **Soluções:** Gaiola de Faraday, hastes Franklin, medição de resistividade do solo pelo método Wenner (4 pontos), medição de malha com terrômetro de alta frequência e laudo técnico para renovação de AVCB e seguradoras.',
        actionType: 'whatsapp',
        actionLabel: '⚡ Laudo de SPDA / Aterramento',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Preciso de laudo técnico ou adequação de SPDA e aterramento para minha empresa.')}`,
      };
    }

    // 5.5. Serviços Já Prestados & Obras Executadas
    if (q.includes('obra') || q.includes('obras') || q.includes('prestado') || q.includes('prestados') || q.includes('foto') || q.includes('fotos') || q.includes('acervo') || q.includes('galeria') || q.includes('portfólio') || q.includes('portfolio')) {
      return {
        text: 'A Omega Engenharia disponibiliza em nosso portal o **Acervo Oficial com 14 Fotografias Reais de Obras e Serviços Já Prestados**:\n\n• **Subestações até 500 kV:** Pátios de transmissão, transformadores com paredes corta-fogo e subestação coletora eólica.\n• **Cabines Primárias & Cubículos:** Montagem de média tensão com disjuntores ABB e cubículos compactos Schneider SM6.\n• **Equipe Própria em Campo:** Registros de técnicos e engenheiros com uniformes e EPIs oficiais Omega.\n• **Instalações Fabris & Painéis:** Grandes centros logísticos, centros de controle de motores (CCM) e QGBTs.\n\nVocê pode clicar na seção **"Obras"** para inspecionar cada registro em alta definição ou conversar com nossos engenheiros.',
        actionType: 'whatsapp',
        actionLabel: '⚡ Orçar Projeto Semelhante no WhatsApp',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar sobre a execução de uma obra semelhante às do acervo da Omega Engenharia.')}`,
      };
    }

    // 6. Contatos, WhatsApp e Instagram
    if (q.includes('contato') || q.includes('whatsapp') || q.includes('telefone') || q.includes('instagram') || q.includes('falar') || q.includes('endereco') || q.includes('endereço') || q.includes('site')) {
      return {
        text: 'Aqui estão os canais oficiais de atendimento direto da **Omega Engenharia e Construções Elétricas**:\n\n• **Plantão WhatsApp:** (11) 98765-4321\n• **Telefone Central:** (11) 3900-8800\n• **Instagram Oficial:** [@grupo_omega_construtora](https://www.instagram.com/grupo_omega_construtora/)\n• **Portal Oficial:** omegaportal.com.br\n\nNossos engenheiros atendem todo o território nacional.',
        actionType: 'whatsapp',
        actionLabel: '📲 Abrir Conversa no WhatsApp Agora',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de falar com o plantão de engenharia da Omega.')}`,
      };
    }

    // 7. Orçamento ou Visita Técnica
    if (q.includes('orcar') || q.includes('orçamento') || q.includes('orcamento') || q.includes('visita') || q.includes('preco') || q.includes('preço') || q.includes('custo') || q.includes('contratar')) {
      return {
        text: 'Nossos engenheiros realizam **visitas técnicas in loco** e elaboram propostas técnico-comerciais detalhadas sem compromisso.\n\nVocê pode preencher o configurador de orçamento interativo no site ou falar instantaneamente com nosso coordenador comercial no WhatsApp.',
        actionType: 'quote',
        actionLabel: '📝 Preencher Formulário de Orçamento',
        actionUrl: '#orcamento',
      };
    }

    // 8. General overview
    return {
      text: 'A **Omega Engenharia e Construções Elétricas** conta com mais de 25 anos de atuação sólida nos setores de Geração, Transmissão e Distribuição (GTD).\n\nAtuamos em:\n• **Cabines Primárias (15 a 34,5 kV)**\n• **Subestações até 500 kV**\n• **Barramentos Blindados (Bus Way até 6.000 A)**\n• **Instalações Industriais & Retrofit LED**\n• **Locação de Geradores & Mão de Obra Técnica**\n\nComo posso direcionar seu projeto da melhor forma?',
      actionType: 'whatsapp',
      actionLabel: '💬 Falar com Especialista Técnico',
      actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent(`Olá! Gostaria de consultar sobre: ${query}`)}`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    soundFx.playSwitchClick();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Try server-side Gemini API endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);

      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionType: 'whatsapp',
            actionLabel: '📲 Chamar Engenharia no WhatsApp',
            actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent(`Olá! Estava tirando dúvidas com a Engenheira Virtual sobre: ${messageContent}`)}`,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      // network fallback
    }

    // 2. Fallback to rich embedded technical rule-base
    setTimeout(() => {
      const expert = getLocalExpertReply(messageContent);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: expert.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: expert.actionType,
        actionLabel: expert.actionLabel,
        actionUrl: expert.actionUrl,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 450);
  };

  const handleActionClick = (msg: Message) => {
    soundFx.playSwitchClick();
    if (msg.actionType === 'quote') {
      onNavigateToQuote?.();
      setIsOpen(false);
    } else if (msg.actionUrl) {
      window.open(msg.actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Floating Launcher Button on the LEFT side */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-[60] flex items-center gap-2.5 pointer-events-auto select-none">
        {/* 1. Assistant Trigger Button with AI-Generated Human Engineer Photo */}
        <button
          onClick={() => {
            soundFx.playSwitchClick();
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-slate-900 shadow-[0_4px_28px_rgba(201,162,39,0.55)] hover:shadow-[0_6px_36px_rgba(0,212,255,0.65)] hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-[#C9A227] cursor-pointer shrink-0"
          aria-label={isOpen ? 'Fechar Assistente Virtual' : 'Abrir Assistente Virtual da Omega'}
          title="Falar com a Engenheira Virtual"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full border-2 border-[#C9A227] opacity-40 animate-ping pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-[#F5E6B3]" />
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden p-0.5">
              <img
                src={assistantAvatarImg}
                alt="Engenheira Virtual Omega"
                className="w-full h-full object-cover object-top rounded-full transition-transform duration-300 group-hover:scale-110"
              />
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" />
            </div>
          )}

          {/* Unread dot indicator */}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          )}
        </button>

        {/* 2. Floating invitation pill (reversed position: on the right of the button; and reversed text: Dúvidas Técnicas • Engenheira Virtual) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              soundFx.playSwitchClick();
              setIsOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/95 hover:bg-slate-900 text-white text-[11px] sm:text-xs font-semibold shadow-xl border border-[#C9A227]/70 hover:border-[#C9A227] backdrop-blur-md cursor-pointer group transition-all"
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="group-hover:text-[#F5E6B3] transition-colors whitespace-nowrap">
              Dúvidas Técnicas • <span className="text-[#C9A227] font-bold">Engenheira Virtual</span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Floating Chat Modal on the LEFT side */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-22 left-3 sm:left-6 z-[70] w-[calc(100vw-1.5rem)] sm:w-[410px] md:w-[440px] max-h-[82vh] h-[580px] rounded-2xl bg-[#0F172A] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#0A3D4A] via-[#06242C] to-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border-2 border-[#C9A227] overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={assistantAvatarImg}
                    alt="Engenheira Virtual Omega"
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-display text-white">
                      Engenheira Virtual Omega
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40">
                      IA 24h
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Especialista em Média & Alta Tensão
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`${whatsAppBaseUrl}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20t%C3%A9cnico%20da%20Omega%20Engenharia`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors border border-emerald-500/40"
                  title="Abrir WhatsApp oficial"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Minimizar assistente"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono text-[#C9A227] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                <Zap className="w-3 h-3 text-[#C9A227]" />
                Perguntas Frequentes:
              </span>
              {QUICK_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 bg-slate-800/80 hover:bg-[#0A3D4A] hover:text-white transition-colors whitespace-nowrap border border-slate-700/60 shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-full border border-[#C9A227] overflow-hidden shrink-0 mt-0.5 shadow-xs">
                      <img
                        src={assistantAvatarImg}
                        alt="Engenheira"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0A3D4A] to-[#0f4f5f] text-white rounded-tr-xs border border-[#1E6A7D]'
                        : 'bg-slate-800/90 text-slate-200 rounded-tl-xs border border-slate-700/80 shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>

                    {/* Attached Action Button to direct users to contacts */}
                    {msg.actionType && msg.actionType !== 'none' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleActionClick(msg)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                            msg.actionType === 'quote'
                              ? 'bg-[#C9A227] hover:bg-[#d8b132] text-slate-950 font-bold'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                          }`}
                        >
                          <span>{msg.actionLabel || 'Acessar'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 bg-slate-700/80 hover:bg-pink-900/40 hover:text-white transition-colors border border-slate-600/60"
                        >
                          <Instagram className="w-3 h-3 text-pink-400" />
                          <span>Instagram</span>
                        </a>
                      </div>
                    )}

                    <div className="mt-1.5 text-[9px] font-mono text-slate-400 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-full border border-[#C9A227] overflow-hidden shrink-0 shadow-xs">
                    <img
                      src={assistantAvatarImg}
                      alt="Engenheira"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-mono text-slate-300">Consultando engenharia...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct Contact Bar above input */}
            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-[#C9A227] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Plantão Técnico:
              </span>
              <a
                href={whatsAppBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
              >
                (11) 98765-4321
              </a>
              <span className="text-slate-600">|</span>
              <a href="tel:+551139008800" className="hover:text-white">
                (11) 3900-8800
              </a>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0F172A] border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pergunte sobre cabines, subestações, prazos..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-[#C9A227] focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#C9A227] hover:bg-[#d8b132] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

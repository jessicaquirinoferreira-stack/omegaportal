import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Zap,
  PhoneCall,
  ShieldCheck,
  ExternalLink,
  User,
  Instagram,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import assistantAvatarImg from '../assets/images/assistente-virtual-avatar.webp';

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
      actionLabel: 'Chamar Engenheiro no WhatsApp',
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

  const getLocalExpertReply = (
    query: string
  ): { text: string; actionType: Message['actionType']; actionLabel: string; actionUrl: string } => {
    const q = query.toLowerCase();

    if (
      q.includes('cabine') ||
      q.includes('primaria') ||
      q.includes('primária') ||
      q.includes('concessionaria') ||
      q.includes('concessionária') ||
      q.includes('enel') ||
      q.includes('cpfl')
    ) {
      return {
        text: 'A Omega é referência nacional em **Cabines Primárias de 15 kV a 34,5 kV** (abrigadas em alvenaria técnica, blindadas ou simplificadas).\n\n• **Atuação Completa:** Concepção do projeto executivo, entrada de energia perante a concessionária (Enel, CPFL, EDP, etc.), montagem civil-eletromecânica, cubículos de medição e proteção com disjuntores a vácuo/SF6 e comissionamento com emissão de ART.\n• **Normas:** ABNT NBR 14039 e regulamentações específicas de cada distribuidora.\n\nPodemos fazer o levantamento técnico do seu ramal de entrada.',
        actionType: 'whatsapp',
        actionLabel: 'Orçar Cabine Primária no WhatsApp',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar sobre projeto/montagem de Cabine Primária na Omega Engenharia.')}`,
      };
    }

    if (
      q.includes('subestacao') ||
      q.includes('subestação') ||
      q.includes('subestações') ||
      q.includes('500') ||
      q.includes('alta tensao') ||
      q.includes('alta tensão') ||
      q.includes('ons')
    ) {
      return {
        text: 'Executamos e comissionamos **Subestações Transformadoras e Seccionadoras de 69 kV a 500 kV** para concessionárias de transmissão (como CTEEP) e grandes complexos industriais.\n\n• **Escopo:** Montagem de pórticos metálicos, transformadores de força, disjuntores de alta tensão, TCs/TPs, malhas de aterramento profundas e sistemas de supervisão SCADA.\n• **Destaque:** Subestação industrial de 15 MVA entregue para a Hypermarcas em Guarulhos/SP.',
        actionType: 'whatsapp',
        actionLabel: 'Falar sobre Subestação de Alta Tensão',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre a capacidade técnica da Omega em Subestações de Alta Tensão.')}`,
      };
    }

    if (q.includes('bus') || q.includes('way') || q.includes('barramento') || q.includes('barramentos')) {
      return {
        text: 'Os sistemas de **Barramentos Blindados (Bus Way)** da Omega atendem correntes de **até 6.000 A** em cobre eletrolítico ou alumínio estanhado (norma NBR IEC 61439-6).\n\n• **Vantagens:** Substituem feixes pesados de cabos, reduzem queda de tensão, oferecem proteção avançada contra incêndio e permitem caixas plug-in para ligar novas máquinas sem parada fabril.\n• **Cases:** ArcelorMittal, Continental Pneus e Filoauto.',
        actionType: 'whatsapp',
        actionLabel: 'Consultar Projeto de Bus Way',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar dimensionamento de Barramentos Blindados (Bus Way) com a Omega.')}`,
      };
    }

    if (q.includes('manuten') || q.includes('preditiva') || q.includes('termografia') || q.includes('laudo') || q.includes('art') || q.includes('ensaio')) {
      return {
        text: 'Nosso plano de **Manutenção Preditiva & Corretiva** assegura **99.9% de disponibilidade operacional** em indústrias contínuas.\n\n• **Serviços:** Inspeções termográficas com câmeras calibradas, ensaios de isolamento (Megger), injeção de corrente em relés de proteção e reaperto com torquímetro digital.\n• **Documentação:** Relatório fotográfico ABNT com emissão de ART do CREA.',
        actionType: 'whatsapp',
        actionLabel: 'Agendar Inspeção Termográfica',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de agendar inspeção termográfica / manutenção preventiva com a Omega.')}`,
      };
    }

    if (q.includes('spda') || q.includes('aterramento') || q.includes('para-raio') || q.includes('para raio') || q.includes('faraday') || q.includes('franklin') || q.includes('avcb')) {
      return {
        text: 'Realizamos projetos, instalações e laudos de **SPDA e Aterramento Estrutural** conforme a **ABNT NBR 5419 (Partes 1 a 4)**.\n\n• **Soluções:** Gaiola de Faraday, hastes Franklin, medição de resistividade pelo método Wenner, terrômetro de alta frequência e laudo técnico para AVCB e seguradoras.',
        actionType: 'whatsapp',
        actionLabel: 'Laudo de SPDA / Aterramento',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Preciso de laudo técnico ou adequação de SPDA e aterramento para minha empresa.')}`,
      };
    }

    if (q.includes('obra') || q.includes('obras') || q.includes('prestado') || q.includes('prestados') || q.includes('foto') || q.includes('fotos') || q.includes('acervo') || q.includes('galeria') || q.includes('portfólio') || q.includes('portfolio')) {
      return {
        text: 'A Omega Engenharia disponibiliza em nosso portal o **Acervo Oficial com 14 Fotografias Reais de Obras e Serviços Já Prestados**:\n\n• **Subestações até 500 kV:** Pátios de transmissão, transformadores com paredes corta-fogo e subestação coletora eólica.\n• **Cabines Primárias & Cubículos:** Montagem de média tensão com disjuntores ABB e cubículos compactos Schneider SM6.\n• **Equipe Própria em Campo:** Registros de técnicos e engenheiros com EPIs oficiais Omega.\n\nClique na seção **"Obras"** para inspecionar cada registro.',
        actionType: 'whatsapp',
        actionLabel: 'Orçar Projeto Semelhante no WhatsApp',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de consultar sobre a execução de uma obra semelhante às do acervo da Omega Engenharia.')}`,
      };
    }

    if (q.includes('contato') || q.includes('whatsapp') || q.includes('telefone') || q.includes('instagram') || q.includes('falar') || q.includes('endereco') || q.includes('endereço') || q.includes('site')) {
      return {
        text: 'Canais oficiais de atendimento direto da **Omega Engenharia e Construções Elétricas**:\n\n• **Plantão WhatsApp:** (11) 98765-4321\n• **Telefone Central:** (11) 3900-8800\n• **Instagram Oficial:** @grupo_omega_construtora\n• **Portal Oficial:** omegaportal.com.br',
        actionType: 'whatsapp',
        actionLabel: 'Abrir Conversa no WhatsApp Agora',
        actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent('Olá! Gostaria de falar com o plantão de engenharia da Omega.')}`,
      };
    }

    if (q.includes('orcar') || q.includes('orçamento') || q.includes('orcamento') || q.includes('visita') || q.includes('preco') || q.includes('preço') || q.includes('custo') || q.includes('contratar')) {
      return {
        text: 'Nossos engenheiros realizam **visitas técnicas in loco** e elaboram propostas técnico-comerciais detalhadas.\n\nVocê pode preencher o configurador de orçamento no site ou falar diretamente com nosso coordenador comercial no WhatsApp.',
        actionType: 'quote',
        actionLabel: 'Preencher Formulário de Orçamento',
        actionUrl: '#orcamento',
      };
    }

    return {
      text: 'A **Omega Engenharia e Construções Elétricas** conta com mais de 25 anos nos setores de Geração, Transmissão e Distribuição (GTD).\n\nAtuamos em:\n• **Cabines Primárias (15 a 34,5 kV)**\n• **Subestações até 500 kV**\n• **Barramentos Blindados (Bus Way até 6.000 A)**\n• **Instalações Industriais & Retrofit LED**\n• **Locação de Geradores & Mão de Obra Técnica**\n\nComo posso direcionar seu projeto?',
      actionType: 'whatsapp',
      actionLabel: 'Falar com Especialista Técnico',
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent }),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionType: 'whatsapp',
            actionLabel: 'Chamar Engenharia no WhatsApp',
            actionUrl: `${whatsAppBaseUrl}?text=${encodeURIComponent(`Olá! Estava tirando dúvidas com a Engenheira Virtual sobre: ${messageContent}`)}`,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // network fallback
    } finally {
      clearTimeout(timeoutId);
    }

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
      <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-[60] flex items-center gap-2 pointer-events-auto select-none">
        <button
          onClick={() => {
            soundFx.playSwitchClick();
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900 shadow-[0_6px_24px_rgba(10,61,74,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#C9A227] cursor-pointer shrink-0"
          aria-label={isOpen ? 'Fechar Assistente Virtual' : 'Abrir Assistente Virtual da Omega'}
          title="Falar com a Engenheira Virtual"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#F5E6B3]" />
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden p-0.5">
              <img
                src={assistantAvatarImg}
                alt="Engenheira Virtual Omega"
                width={52}
                height={52}
                className="w-full h-full object-cover object-top rounded-full transition-transform duration-200 group-hover:scale-105"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
          )}

          {!isOpen && hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          )}
        </button>

        {/* Reversed label on the right of the avatar button */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => {
              soundFx.playSwitchClick();
              setIsOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/92 backdrop-blur-sm hover:bg-slate-900 text-white text-[11px] font-medium shadow-xl border border-[#C9A227]/60 hover:border-[#C9A227] cursor-pointer group transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="group-hover:text-[#F5E6B3] transition-colors whitespace-nowrap">
              Dúvidas Técnicas · <span className="text-[#C9A227] font-bold">Engenheira Virtual</span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Floating Chat Modal on the LEFT side */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 left-3 sm:left-6 z-[80] w-[calc(100vw-1.5rem)] sm:w-[400px] max-h-[75dvh] sm:max-h-[80vh] h-[520px] sm:h-[560px] rounded-xl bg-[#0B1721] border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
          >
            <div className="px-4 py-3.5 bg-[#071E26] border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border-2 border-[#C9A227] overflow-hidden shrink-0">
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
                    <span className="text-[10px] font-mono font-bold text-[#C9A227]">24h</span>
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
                  className="p-2 rounded-lg bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors border border-emerald-500/40"
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

            <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono text-[#C9A227] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                <Zap className="w-3 h-3" />
                Perguntas:
              </span>
              {QUICK_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 bg-slate-800/80 hover:bg-[#0A3D4A] hover:text-white transition-colors whitespace-nowrap border border-slate-700/60 shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-full border border-[#C9A227] overflow-hidden shrink-0 mt-0.5">
                      <img
                        src={assistantAvatarImg}
                        alt="Engenheira"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0A3D4A] text-white border border-[#1E6A7D]'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={idx} className="font-bold text-white">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <React.Fragment key={idx}>{part}</React.Fragment>
                        )
                      )}
                    </div>

                    {msg.actionType && msg.actionType !== 'none' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleActionClick(msg)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            msg.actionType === 'quote'
                              ? 'bg-[#C9A227] hover:bg-[#d8b132] text-slate-950'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
                  <div className="w-7 h-7 rounded-full border border-[#C9A227] overflow-hidden shrink-0">
                    <img
                      src={assistantAvatarImg}
                      alt="Engenheira"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-mono text-slate-300">
                      Consultando engenharia...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-[#C9A227] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Plantão:
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0B1721] border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pergunte sobre cabines, subestações, prazos..."
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#C9A227] focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-lg bg-[#C9A227] hover:bg-[#d8b132] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-colors cursor-pointer shrink-0"
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

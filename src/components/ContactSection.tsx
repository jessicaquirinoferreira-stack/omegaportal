import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { ArchitecturalBrackets, EditorialReveal } from './ui/IndustrialEffects';

export const ContactSection: React.FC = () => {
  const [sentMessage, setSentMessage] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setSentMessage(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    }, 450);
  };

  return (
    <section
      id="contato"
      className="cv-auto py-20 lg:py-28 bg-white dark:bg-[#060E14] border-b border-slate-200 dark:border-slate-800/90 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-25 dark:opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <EditorialReveal className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#996515] dark:text-[#C9A227] font-bold mb-3">
            <span>07 · Canais Oficiais</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Atendimento & Localização</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-4 leading-[1.08]">
            Conecte-se com a diretoria técnica da Omega Engenharia.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Sede operacional em São Paulo, com capacidade técnica e logística para mobilização em subestações e parques fabris em todo o território nacional.
          </p>
        </EditorialReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hairline Architectural Directory */}
          <div className="lg:col-span-5 divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            <div className="py-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] font-mono">
                  Sede Operacional
                </h3>
                <p className="text-sm text-slate-950 dark:text-white mt-1 font-semibold">
                  São Paulo / SP – Brasil
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Atendimento técnico nacional, com foco nos polos industriais de SP, PR, RJ, MG e DF.
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] font-mono">
                  Telefones Oficiais & Plantão
                </h3>
                <p className="text-sm text-slate-950 dark:text-white mt-1 font-mono font-semibold tabular-nums">
                  (11) 3900-8800 · Central
                </p>
                <p className="text-xs text-[#996515] dark:text-[#C9A227] font-mono mt-0.5 font-semibold tabular-nums">
                  (11) 98765-4321 · Plantão de Engenharia
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] font-mono">
                  E-mails Corporativos
                </h3>
                <p className="text-sm text-slate-950 dark:text-white mt-1 font-mono">
                  contato@omegaportal.com.br
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  comercial@omegaportal.com.br
                </p>
              </div>
            </div>

            <div className="py-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] font-mono">
                  Horário Técnico
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  Segunda a Sexta: 07h30 às 18h00
                </p>
                <p className="text-xs text-[#996515] dark:text-[#C9A227] mt-0.5 font-medium">
                  Equipe de emergência em subestações: Atendimento 24/7 sob contrato.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="relative lg:col-span-7 p-6 sm:p-9 rounded-xl bg-[#F6F8FA] dark:bg-[#08131A] border border-slate-200 dark:border-slate-800">
            <ArchitecturalBrackets sizeClass="w-3 h-3" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0A3D4A] dark:text-[#C9A227] flex items-center gap-1.5 font-bold">
                <MessageSquare className="w-4 h-4" />
                Mensagem Direta para a Engenharia
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Resposta Técnica Rápida
              </span>
            </div>

            {sentMessage ? (
              <div className="p-8 text-center rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40">
                <CheckCircle2 className="w-11 h-11 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-1">
                  Mensagem Transmitida com Sucesso
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto mb-5">
                  Recebemos seu contato técnico e nossa equipe comercial retornará pelo canal indicado em breve.
                </p>
                <button
                  onClick={() => setSentMessage(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Mendes"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0A3D4A] dark:focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                      Seu E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: roberto@empresa.com.br"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0A3D4A] dark:focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Assunto / Motivo do Contato
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Ex: Manutenção preventiva em subestação / Nova cabine primária"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0A3D4A] dark:focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Mensagem / Dúvida Técnica *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva brevemente a sua dúvida ou a necessidade da sua empresa..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0A3D4A] dark:focus:border-[#C9A227]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-metallic-sheen w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.08em] text-white bg-[#0A3D4A] hover:bg-[#0d4d5e] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#DFBA48] transition-colors cursor-pointer"
                  >
                    <span>Enviar Mensagem</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

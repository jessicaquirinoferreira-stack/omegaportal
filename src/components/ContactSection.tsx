import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [sentMessage, setSentMessage] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setSentMessage(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 500);
  };

  return (
    <section id="contato" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#996515] dark:text-[#C9A227] mb-3">
            <span>06. Canais Oficiais</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
            <span>Atendimento & Localização</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-4">
            Conecte-se com a diretoria técnica da Omega Engenharia.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Nossa sede operacional está localizada em São Paulo, com capacidade técnica e logística para mobilização em subestações e parques fabris em todo o território nacional.
          </p>
        </div>

        {/* Contact Info Cards & Direct Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct channels and Headquarters */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#0A3D4A] border border-teal-200 dark:border-[#C9A227]/30 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">
                    Sede Operacional
                  </h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 font-semibold">
                    São Paulo / SP – Brasil
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Atendimento técnico em todo o território nacional, com foco nos polos industriais de SP, PR, RJ, MG e DF.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#0A3D4A] border border-teal-200 dark:border-[#C9A227]/30 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">
                    Telefones Oficiais & Plantão
                  </h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 font-mono font-semibold">
                    (11) 3900-8800 · Central
                  </p>
                  <p className="text-xs text-[#996515] dark:text-[#C9A227] font-mono mt-0.5 font-semibold">
                    (11) 98765-4321 · Plantão de Engenharia
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#0A3D4A] border border-teal-200 dark:border-[#C9A227]/30 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">
                    E-mails Corporativos
                  </h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 font-mono">
                    contato@omegaportal.com.br
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    comercial@omegaportal.com.br
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#0A3D4A] border border-teal-200 dark:border-[#C9A227]/30 flex items-center justify-center text-[#0A3D4A] dark:text-[#C9A227] shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">
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
          </div>

          {/* Right Column: Direct Message Box */}
          <div className="lg:col-span-7 p-7 sm:p-9 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#996515] dark:text-[#C9A227] flex items-center gap-1.5 font-bold">
                <MessageSquare className="w-4 h-4" />
                Mensagem Direta para a Engenharia
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Resposta Técnica Rápida
              </span>
            </div>

            {sentMessage ? (
              <div className="p-8 text-center rounded-xl bg-emerald-50/80 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-1">
                  Mensagem Transmitida com Sucesso!
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto mb-5">
                  Recebemos seu contato técnico e nossa equipe comercial retornará pelo canal indicado em breve.
                </p>
                <button
                  onClick={() => setSentMessage(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-200 hover:bg-slate-300 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Mendes"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
                      Seu E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: roberto@empresa.com.br"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
                    Assunto / Motivo do Contato
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Manutenção preventiva em subestação / Nova cabine primária"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1">
                    Mensagem / Dúvida Técnica *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva brevemente a sua dúvida ou a necessidade da sua empresa..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] transition-colors cursor-pointer shadow-sm"
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

import React from 'react';
import { ArrowUp, ShieldCheck, Zap } from 'lucide-react';
import { OMEGA_LOGO_DARK_SRC, OMEGA_OFFICIAL_LOGO } from '../data/companyData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 text-xs">
      {/* Top Banner: Technical Assurance */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0A3D4A] border border-[#C9A227] flex items-center justify-center text-[#C9A227] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-slate-200 font-medium">
                Engenharia de conformidade plena: Projetos homologados com ART e supervisão do CREA/SP.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
              <span className="font-semibold">NR-10 SEP</span>
              <span>·</span>
              <span className="font-semibold">NBR 14039</span>
              <span>·</span>
              <span className="font-semibold">NBR 5410</span>
              <span>·</span>
              <span className="font-semibold">NBR 5419</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('inicio')}
              className="group block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg"
              aria-label="Omega Engenharia e Construções Elétricas - Início"
            >
              <img
                src={OMEGA_LOGO_DARK_SRC}
                alt="Omega Engenharia e Construções Elétricas"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== OMEGA_LOGO_DARK_SRC) {
                    target.src = OMEGA_LOGO_DARK_SRC;
                  }
                }}
                className="h-12 sm:h-14 md:h-15 w-auto max-w-[260px] sm:max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_2px_18px_rgba(201,162,39,0.35)]"
                loading="lazy"
                decoding="async"
              />
            </button>

            <p className="text-slate-300 leading-relaxed max-w-sm">
              Empresa 100% nacional com mais de 25 anos de experiência no setor elétrico. Especializada em subestações até 500 kV, cabines primárias e grandes instalações industriais. Mais de 200.000 kVA instalados.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/grupo_omega_construtora/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/60 text-pink-300 border border-pink-700/40 text-xs font-semibold transition-colors"
                title="Siga no Instagram: @grupo_omega_construtora"
              >
                <span>Instagram: @grupo_omega_construtora</span>
              </a>

              <a
                href="https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20t%C3%A9cnico%20da%20Omega%20Engenharia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 text-xs font-semibold transition-colors"
                title="Falar no WhatsApp"
              >
                <span>WhatsApp Plantão</span>
              </a>
            </div>

            <div className="font-mono text-[11px] text-[#C9A227] font-semibold">
              Portal Oficial: omegaportal.com.br
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('empresa')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  A Empresa & Trajetória
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('servicos')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Serviços de Engenharia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('obras')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer text-slate-300 flex items-center gap-1.5"
                >
                  <span>Obras & Acervo (14 Fotos)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#C9A227]/20 text-[#C9A227]">
                    Real
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('clientes')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Clientes & Cases Reais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculadora')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Calculadora de Demanda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orcamento')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Solicitar Orçamento
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Disciplinas Principais
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>Cabines Primárias (15 a 34,5 kV)</li>
              <li>Subestações até 500 kV</li>
              <li>Instalações Industriais</li>
              <li>Barramentos Blindados (Bus Way)</li>
              <li>Manutenção de Transformadores</li>
              <li>SPDA e Aterramento NBR 5419</li>
              <li>Eletrificação de Loteamentos</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Atendimento Corporativo
            </h4>
            <div className="space-y-2.5">
              <p className="text-slate-200 font-medium">São Paulo / SP – Brasil</p>
              <p className="font-mono text-slate-200 font-semibold">(11) 3900-8800</p>
              <p className="font-mono text-[#C9A227] font-semibold">(11) 98765-4321</p>
              <p className="font-mono text-slate-300">contato@omegaportal.com.br</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('orcamento')}
                  className="w-full py-2.5 px-3 rounded-lg text-center text-xs font-bold uppercase text-slate-950 bg-[#C9A227] hover:bg-[#deb338] transition-colors cursor-pointer shadow-sm"
                >
                  Orçamento Técnico
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} Omega Engenharia e Construções Elétricas. Todos os direitos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            aria-label="Voltar ao topo da página"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

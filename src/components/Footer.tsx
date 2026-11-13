import React, { useState, useEffect } from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { OMEGA_LOGO_SRC, OMEGA_OFFICIAL_LOGO } from '../data/companyData';
import { getDarkLogoDataUrl } from '../utils/logoProcessor';
import { CircuitFlowBackdrop } from './ui/IndustrialEffects';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToTop }) => {
  const [darkLogoSrc, setDarkLogoSrc] = useState<string>(OMEGA_LOGO_SRC);

  useEffect(() => {
    getDarkLogoDataUrl(OMEGA_LOGO_SRC, (res) => {
      setDarkLogoSrc(res);
    }, OMEGA_OFFICIAL_LOGO);
  }, []);

  const handleTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="cv-auto bg-[#04090D] border-t border-slate-800 text-slate-300 text-xs relative overflow-hidden">
      <CircuitFlowBackdrop variant="footer" />

      {/* Top Banner */}
      <div className="border-b border-slate-800/90 bg-[#061118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span className="text-slate-200 font-medium">
                Engenharia de conformidade plena: Projetos homologados com ART e supervisão do CREA/SP.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="font-semibold text-slate-200">NR-10 SEP</span>
              <span>·</span>
              <span className="font-semibold text-slate-200">NBR 14039</span>
              <span>·</span>
              <span className="font-semibold text-slate-200">NBR 5410</span>
              <span>·</span>
              <span className="font-semibold text-slate-200">NBR 5419</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('inicio')}
              className="group block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg bg-transparent"
              aria-label="Grupo Omega - Engenharia e Construções Elétricas - Início"
            >
              <img
                src={darkLogoSrc}
                alt="Grupo Omega - Engenharia e Construções Elétricas"
                width={260}
                height={130}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== OMEGA_OFFICIAL_LOGO) {
                    target.src = OMEGA_OFFICIAL_LOGO;
                  }
                }}
                className="h-14 sm:h-16 w-auto max-w-[240px] sm:max-w-[260px] object-contain bg-transparent transition-transform duration-300 group-hover:scale-[1.02] filter brightness-110 drop-shadow-[0_0_2px_rgba(255,255,255,0.95)]"
                loading="lazy"
                decoding="async"
              />
            </button>

            <p className="text-slate-300 leading-relaxed max-w-sm">
              Empresa 100% nacional com mais de 25 anos de experiência no setor elétrico. Especializada em subestações até 500 kV, cabines primárias e grandes instalações industriais. Mais de 200.000 kVA instalados.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/grupo_omega_construtora/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-medium transition-colors"
                title="Instagram: @grupo_omega_construtora"
              >
                <span>Instagram · @grupo_omega_construtora</span>
              </a>

              <a
                href="https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20t%C3%A9cnico%20da%20Omega%20Engenharia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-medium transition-colors"
                title="Falar no WhatsApp"
              >
                <span>WhatsApp Plantão</span>
              </a>
            </div>

            <div className="font-mono text-[11px] text-[#C9A227] font-semibold">
              Portal Oficial: omegaportal.com.br
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white font-mono mb-4">
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
                  onClick={() => onNavigate('maqueta3d')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer text-slate-300"
                >
                  Subestação 3D
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
                  className="hover:text-[#C9A227] transition-colors cursor-pointer text-slate-300"
                >
                  Obras & Acervo (14 Fotos)
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
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white font-mono mb-4">
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

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white font-mono mb-4">
              Atendimento Corporativo
            </h4>
            <div className="space-y-2.5">
              <p className="text-slate-200 font-medium">São Paulo / SP – Brasil</p>
              <p className="font-mono text-slate-200 font-semibold tabular-nums">(11) 3900-8800</p>
              <p className="font-mono text-[#C9A227] font-semibold tabular-nums">(11) 98765-4321</p>
              <p className="font-mono text-slate-300">contato@omegaportal.com.br</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('orcamento')}
                  className="btn-metallic-sheen w-full py-2.5 px-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] transition-colors cursor-pointer"
                >
                  Orçamento Técnico
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black pt-5 pb-20 sm:pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} Omega Engenharia e Construções Elétricas. Todos os direitos reservados.
          </p>

          <button
            onClick={handleTop}
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

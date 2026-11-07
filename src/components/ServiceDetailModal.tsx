import React from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Zap, FileText } from 'lucide-react';
import { ServiceDetail } from '../data/companyData';

interface ServiceDetailModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onRequestQuote,
}) => {
  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Fechar detalhes do serviço"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with technical classification */}
        <div className="mb-6 pr-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#996515] dark:text-[#C9A227] mb-2 uppercase tracking-wider">
            <span className="font-semibold">{service.category}</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{service.voltageRange}</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-slate-600 dark:text-slate-300">{service.standard}</span>
          </div>
          <h3 id="modal-title" className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white">
            {service.title}
          </h3>
        </div>

        {/* Visual Media if present */}
        {service.imageSrc && (
          <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-slate-800">
            <img
              src={service.imageSrc}
              alt={service.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (service.imageFallback && target.src !== service.imageFallback) {
                  target.src = service.imageFallback;
                }
              }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                Conformidade ABNT & Normas Regulamentadoras
              </span>
              <span className="text-[#C9A227] font-bold">{service.voltageRange}</span>
            </div>
          </div>
        )}

        {/* Full technical description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
            Escopo da Solução
          </h4>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {service.fullDesc}
          </p>
        </div>

        {/* Two Columns: Features & Deliverables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#996515] dark:text-[#C9A227] mb-3 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5" />
              Diferenciais de Engenharia
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {service.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#996515] dark:text-[#C9A227] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A3D4A] dark:text-[#C9A227] mb-3 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5" />
              Entregáveis & Documentação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {service.deliverables.map((deliv) => (
                <li key={deliv} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Homologação garantida nas principais concessionárias do país.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestQuote(service.title);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Solicitar Orçamento Deste Serviço</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

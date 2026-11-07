import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Zap, Copy, Check, FileCheck2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateQuoteForm, generateQuoteProtocol, QuoteFormState } from '../utils/engineering';

interface QuoteSectionProps {
  initialService?: string;
  initialKva?: number;
  initialSubstationType?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  initialService,
  initialKva,
  initialSubstationType,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuoteFormState>({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: initialService || 'Cabines Primárias (15 a 34,5 kV)',
    voltageRating: '13,8 kV / 15 kV',
    powerKva: initialKva ? `${initialKva} kVA` : '',
    location: '',
    message: initialSubstationType ? `Infraestrutura recomendada: ${initialSubstationType}` : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);

  // Sync incoming props
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, serviceType: initialService }));
    }
    if (initialKva) {
      setFormData((prev) => ({ ...prev, powerKva: `${initialKva} kVA` }));
    }
    if (initialSubstationType) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message ? `${prev.message} | ${initialSubstationType}` : initialSubstationType,
      }));
    }
  }, [initialService, initialKva, initialSubstationType]);

  const serviceOptions = [
    'Cabines Primárias (15 a 34,5 kV)',
    'Subestações até 500 kV',
    'Instalações Industriais Completas',
    'Barramentos Blindados (Bus Way)',
    'Transformadores de Força (Instalação/Tratamento)',
    'Manutenção Preditiva & Corretiva em Subestações',
    'SPDA e Aterramento Estrutural (NBR 5419)',
    'Montagem de Painéis Elétricos & CCMs',
    'Eletrificação de Loteamentos & Redes',
    'Iluminação Industrial & Retrofit LED',
    'Locação de Equipamentos e Grupos Geradores',
    'Fornecimento de Pessoal Técnico Especializado',
  ];

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.serviceType) {
        setErrors({ serviceType: 'Selecione uma modalidade de serviço.' });
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Validate full form
      const validation = validateQuoteForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      // Simulate technical dispatch & protocol creation
      setTimeout(() => {
        const generatedProto = generateQuoteProtocol('OMG');
        setProtocol(generatedProto);
        setIsSubmitting(false);
        setStep(4);

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#C9A227', '#0A3D4A', '#ffffff'],
          });
        } catch {
          // ignore if canvas-confetti unsupported
        }
      }, 700);
    }
  };

  const handleCopyProtocol = () => {
    if (!protocol) return;
    navigator.clipboard.writeText(protocol);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      serviceType: 'Cabines Primárias (15 a 34,5 kV)',
      voltageRating: '13,8 kV / 15 kV',
      powerKva: '',
      location: '',
      message: '',
    });
    setProtocol('');
    setStep(1);
  };

  return (
    <section id="orcamento" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#996515] dark:text-[#C9A227] mb-3">
            <span>05. Atendimento Comercial & Técnico</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
            <span>Solicitação de Proposta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-950 dark:text-white tracking-tight mb-4">
            Solicite um Orçamento Técnico Especializado.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Preencha os dados da sua indústria ou empreendimento para receber uma proposta orçamentária detalhada com memorial técnico de engenharia.
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className={step >= 1 ? 'text-[#996515] dark:text-[#C9A227] font-bold' : 'text-slate-400 dark:text-slate-500'}>
              1. Escopo do Serviço
            </span>
            <span className={step >= 2 ? 'text-[#996515] dark:text-[#C9A227] font-bold' : 'text-slate-400 dark:text-slate-500'}>
              2. Parâmetros Técnicos
            </span>
            <span className={step >= 3 ? 'text-[#996515] dark:text-[#C9A227] font-bold' : 'text-slate-400 dark:text-slate-500'}>
              3. Dados da Empresa
            </span>
            <span className={step >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
              4. Protocolo Gerado
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0A3D4A] via-[#996515] to-[#C9A227] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="p-7 sm:p-10 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm relative">
          {/* STEP 1: Service Type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white mb-2">
                Selecione o serviço ou modalidade técnica
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Escolha a disciplina elétrica principal da sua necessidade.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {serviceOptions.map((opt) => {
                  const isSelected = formData.serviceType === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: opt })}
                      className={`text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-50 border-2 border-[#0A3D4A] text-[#0A3D4A] font-semibold dark:bg-[#0A3D4A]/50 dark:border-[#C9A227] dark:text-white shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A3D4A] dark:text-[#C9A227] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {errors.serviceType && (
                <p className="text-rose-600 dark:text-rose-400 text-xs mb-4">{errors.serviceType}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] transition-colors cursor-pointer shadow-sm"
                >
                  <span>Avançar para Parâmetros</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Parameters */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white mb-2">
                Parâmetros técnicos preliminares
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Informe valores estimados para que o dimensionamento preliminar seja mais assertivo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Demanda / Potência Estimada (kVA ou MVA)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1.500 kVA ou 5 MVA"
                    value={formData.powerKva || ''}
                    onChange={(e) => setFormData({ ...formData, powerKva: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Caso não saiba, use nossa Calculadora de Demanda.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Classe de Tensão Primária
                  </label>
                  <select
                    value={formData.voltageRating || '13,8 kV / 15 kV'}
                    onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  >
                    <option value="13,8 kV / 15 kV">13,8 kV / 15 kV (Padrão Distribuição Urbana)</option>
                    <option value="23,0 kV">23,0 kV</option>
                    <option value="34,5 kV">34,5 kV (Classe Média Tensão Elevada)</option>
                    <option value="69 kV a 138 kV">69 kV a 138 kV (Subestações de Alta Tensão)</option>
                    <option value="230 kV a 500 kV">230 kV a 500 kV (Extra Alta Tensão)</option>
                    <option value="Baixa Tensão (380/220V)">Baixa Tensão Industrial (380/220V ou 440V)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Cidade e Estado da Obra
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Guarulhos / SP"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Concessionária de Energia Local
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Enel SP, CPFL Paulista, EDP, Cemig"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] transition-colors cursor-pointer shadow-sm"
                >
                  <span>Avançar para Contato</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Corporate Contact Data */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold font-display text-slate-950 dark:text-white mb-2">
                Identificação corporativa e contato
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Informe os dados do responsável técnico ou de compras para envio da proposta formal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none ${
                      errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-[#996515] dark:focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.name && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Empresa / Razão Social *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Indústria Metalúrgica Paulista Ltda"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none ${
                      errors.company ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-[#996515] dark:focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.company && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: engenharia@suaempresa.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-[#996515] dark:focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.email && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Telefone / WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: (11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none ${
                      errors.phone ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-[#996515] dark:focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.phone && <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
                    Observações Técnicas / Descrição da Necessidade
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detalhe particularidades da obra, prazo estimado ou condições da edificação..."
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#996515] dark:focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#996515] hover:bg-[#855712] dark:text-slate-950 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processando Solicitação...</span>
                  ) : (
                    <>
                      <span>Transmitir Solicitação Técnica</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation with Protocol Code */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-display text-slate-950 dark:text-white mb-2">
                Solicitação de Orçamento Registrada com Sucesso!
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto mb-6">
                Um engenheiro da equipe comercial da <strong>Omega Engenharia</strong> entrará em contato em até 24 horas úteis para validar o escopo e enviar a proposta formal.
              </p>

              {/* Protocol Badge */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#C9A227]/40 mb-8 flex items-center justify-between shadow-xs">
                <div className="text-left">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">Número do Protocolo Técnico:</span>
                  <span className="text-lg font-mono font-bold text-[#996515] dark:text-[#C9A227] tracking-wider">{protocol}</span>
                </div>
                <button
                  onClick={handleCopyProtocol}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Copiar protocolo"
                >
                  {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Summary of Request */}
              <div className="max-w-lg mx-auto text-left p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 mb-8 font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Serviço:</span>
                  <span className="text-slate-950 dark:text-white font-medium">{formData.serviceType}</span>
                </div>
                {formData.powerKva && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Potência Informada:</span>
                    <span className="text-slate-950 dark:text-white font-medium">{formData.powerKva}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Empresa:</span>
                  <span className="text-slate-950 dark:text-white font-medium">{formData.company}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Responsável:</span>
                  <span className="text-slate-950 dark:text-white font-medium">{formData.name}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Nova Solicitação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

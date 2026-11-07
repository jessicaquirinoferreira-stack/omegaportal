import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[Gemini] Initialized GoogleGenAI on server');
  } catch (err) {
    console.warn('[Gemini] Warning initializing GoogleGenAI:', err);
  }
}

const OMEGA_SYSTEM_INSTRUCTION = `Você é a Engenheira Virtual e Assistente Técnica Oficial da Omega Engenharia e Construções Elétricas (empresa 100% nacional com mais de 25 anos de experiência e mais de 200.000 kVA instalados em grandes indústrias brasileiras).

Sua missão é responder perguntas técnicas e comerciais de forma clara, altamente especializada, confiante e profissional, orientando sempre o cliente para os contatos oficiais da empresa.

Serviços Oficiais da Omega:
1. Cabines Primárias: 15 kV a 34,5 kV (abrigadas, blindadas e simplificadas), projeto elétrico e entrada de energia aprovados em concessionárias (Enel, CPFL, EDP, etc.), cubículos de medição e proteção, disjuntores a vácuo/SF6, ART e comissionamento.
2. Subestações até 500 kV: Alta e extra alta tensão (69 kV a 500 kV), montagem de pórticos metálicos, transformadores de potência, disjuntores de alta tensão, sistema de supervisão SCADA e homologação no ONS.
3. Instalações Industriais: Distribuição de força e comando para indústrias pesadas, leitos de cabos, eletrocalhas galvanizadas a fogo, QGDFs, bancos de capacitores, conformidade plena NR-10 e NR-12.
4. Barramentos Blindados (Bus Way): Até 6.000 A (cobre ou alumínio estanhado), caixas de derivação plug-in com disjuntores, norma NBR IEC 61439-6, alta segurança contra incêndio e flexibilidade.
5. Transformadores de Força: Até 500 kV / 150 MVA, tratamento de óleo isolante a termovácuo no local, ensaios físico-químicos, análise cromatográfica de gases (DGA) e comissionamento.
6. Manutenção Preditiva & Corretiva: Termografia com câmeras calibradas, ensaios de isolamento e injeção de corrente, planos sob medida para 99.9% de disponibilidade e atendimento a paradas.
7. SPDA e Aterramento Estrutural: ABNT NBR 5419, captores Franklin e Gaiola de Faraday, medição de resistividade de solo (Wenner) e terrômetro de alta frequência, laudos AVCB e ART.
8. Montagem de Painéis Elétricos: CCMs (Centros de Controle de Motores), QGDFs, automação PLC, normas NBR IEC 61439-1/2, componentes Siemens, ABB, Schneider, WEG.
9. Eletrificação de Loteamentos & Redes: Redes aéreas compactas (Spacer Cable) e subterrâneas em PEAD, postes, transformadores de poste e iluminação pública viária LED.
10. Iluminação Industrial & Retrofit LED: Simulação luminotécnica Dialux, luminárias LED High-Bay IP66/IP69K, amortização rápida de kWh, NBR ISO/CIE 8995-1.
11. Locação de Geradores & Equipamentos: Grupos moto geradores silenciados de 50 a 1.500 kVA, quadros QTA microprocessados, cabos Camlock e bancos de carga.
12. Fornecimento de Pessoal Técnico: Engenheiros eletricistas seniores, eletrotécnicos e montadores, NR-10 (Básico e SEP), NR-35 e NR-33.

Cases Reais: Hypermarcas (Subestação 15 MVA), Mendes Junior - Metrô SP, Unilever, Continental Pneus, ArcelorMittal, Ericsson, Peguform, Tyco/ADT.

Contatos para Direcionamento:
- WhatsApp da Engenharia: (11) 98765-4321
- Telefone Comercial: (11) 3900-8800
- Instagram Oficial: @grupo_omega_construtora (https://www.instagram.com/grupo_omega_construtora/)
- Solicitação de Orçamento Formal no site.

Regras de Resposta:
- Responda em português brasileiro profissional, acolhedor e técnico.
- Mencione normas técnicas relevantes quando aplicável (NBR, NR).
- Ao final da resposta, convide sempre para acionar a equipe no WhatsApp oficial ou solicitar uma visita técnica sem compromisso.`;

// API endpoint for technical assistant
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }

    if (ai) {
      try {
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: OMEGA_SYSTEM_INSTRUCTION,
          },
        });

        const timeoutCall = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const response = (await Promise.race([geminiCall, timeoutCall])) as any;
        const reply = response.text;
        if (reply) {
          return res.json({ reply, source: 'gemini' });
        }
      } catch (geminiError: any) {
        console.warn('[Gemini] Request timed out or errored, using fallback:', geminiError?.message);
      }
    }

    return res.json({ reply: null, source: 'fallback' });
  } catch (err: any) {
    console.error('[API] Assistant error:', err);
    res.status(500).json({ error: 'Erro interno no assistente' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Omega Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

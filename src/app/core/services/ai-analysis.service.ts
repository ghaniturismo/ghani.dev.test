import { Injectable, signal } from '@angular/core';

export interface AnalysisPrompt {
  id: string;
  label: string;
  icon: string;
  description: string;
  build: (ticker: string) => string;
}

export const ANALYSIS_PROMPTS: AnalysisPrompt[] = [
  {
    id: 'wall-street',
    label: 'Wall Street Analysis',
    icon: 'trending_up',
    description: 'Analyse complète style analyste senior Wall Street',
    build: (ticker) => `Act like a senior Wall Street equity research analyst.

Analyze the stock: ${ticker}.

Include:
• Business model and revenue streams
• Competitive advantages (moat)
• Industry trends
• Financial health (revenue growth, margins, debt)
• Key risks
• Valuation vs competitors
• Bull, bear, and base case scenarios
• 12–24 month outlook

Explain in simple terms but with professional insights. Use markdown formatting with headers and bullet points.`,
  },
  {
    id: 'financial-breakdown',
    label: 'Deep Financial Breakdown',
    icon: 'analytics',
    description: 'Analyse financière des 5 dernières années',
    build: (ticker) => `Act like a CFA-certified financial analyst.

Analyze the last 5 years of financials for ${ticker}.

Break down:
• Revenue growth year over year
• Net income trends
• Free cash flow generation
• Profit margins (gross, operating, net)
• Debt levels and leverage ratios
• Return on equity and return on invested capital

Explain whether the company is financially strong or weakening, and what the numbers tell us about future prospects. Use markdown formatting with headers and bullet points.`,
  },
  {
    id: 'moat-analysis',
    label: 'Competitive Moat Analysis',
    icon: 'shield',
    description: "Évaluation de l'avantage concurrentiel (moat)",
    build: (ticker) => `Act like a Warren Buffett–style value investor.

Evaluate the competitive moat of ${ticker}.

Discuss:
• Brand strength and pricing power
• Network effects
• Switching costs for customers
• Cost advantage vs competitors
• Patents, proprietary tech, or regulatory licenses

Compare with top 3 competitors and rate the moat from 1–10 with justification.

Use markdown formatting with headers and bullet points.`,
  },
];

const LS_GEMINI_KEY = 'portfolio_gemini_key';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

@Injectable({ providedIn: 'root' })
export class AiAnalysisService {
  readonly geminiKey = signal<string>(localStorage.getItem(LS_GEMINI_KEY) ?? '');

  saveGeminiKey(key: string): void {
    this.geminiKey.set(key.trim());
    localStorage.setItem(LS_GEMINI_KEY, key.trim());
  }

  async analyze(promptText: string): Promise<string> {
    const key = this.geminiKey();
    if (!key) throw new Error('NO_KEY');

    const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      const msg = err?.error?.message ?? `Erreur HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Aucune réponse reçue.';
  }
}


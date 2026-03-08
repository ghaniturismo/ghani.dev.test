import { Injectable, signal } from '@angular/core';

const LS_API_KEY = 'portfolio_api_key';

interface FinnhubQuote { c: number; pc: number; }

export interface QuoteResult { price: number; change: number; pct: number; }

const MOCK: Record<string, QuoteResult> = {
  AAPL:  { price: 213.49, change:  1.24, pct:  0.58 },
  MSFT:  { price: 415.32, change: -2.10, pct: -0.50 },
  TSLA:  { price: 176.75, change:  5.45, pct:  3.18 },
  GOOGL: { price: 175.84, change:  0.92, pct:  0.53 },
  AMZN:  { price: 198.12, change: -1.55, pct: -0.78 },
  NVDA:  { price: 875.60, change: 22.10, pct:  2.59 },
  META:  { price: 507.23, change:  3.87, pct:  0.77 },
  BNPP:  { price:  64.50, change: -0.30, pct: -0.46 },
  MC:    { price: 612.80, change:  4.20, pct:  0.69 },
  TTE:   { price:  58.32, change:  0.54, pct:  0.93 },
};

@Injectable({ providedIn: 'root' })
export class QuoteService {
  readonly apiKey = signal<string>(localStorage.getItem(LS_API_KEY) ?? '');

  saveApiKey(key: string): void {
    this.apiKey.set(key.trim());
    localStorage.setItem(LS_API_KEY, key.trim());
  }

  async fetchQuote(ticker: string): Promise<QuoteResult> {
    const key = this.apiKey();
    if (!key) return this._mock(ticker);
    try {
      const res  = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${key}`);
      const data = await res.json() as FinnhubQuote;
      if (!data?.c) return this._mock(ticker);
      const change = +(data.c - data.pc).toFixed(2);
      const pct    = data.pc > 0 ? +((change / data.pc) * 100).toFixed(2) : 0;
      return { price: data.c, change, pct };
    } catch {
      return this._mock(ticker);
    }
  }

  private _mock(ticker: string): QuoteResult {
    const base = MOCK[ticker.toUpperCase()];
    if (base) {
      const jitter = (Math.random() - 0.5) * 0.8;
      return { price: +(base.price + jitter).toFixed(2), change: base.change, pct: base.pct };
    }
    const price  = +(50 + Math.random() * 400).toFixed(2);
    const change = +((Math.random() - 0.5) * 5).toFixed(2);
    return { price, change, pct: +((change / price) * 100).toFixed(2) };
  }
}

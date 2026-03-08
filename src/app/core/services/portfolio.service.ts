import { Injectable, signal, computed } from '@angular/core';
import { Position, PositionRow, PortfolioStats } from '../models/position.model';

const LS_KEY = 'portfolio_positions';

type QuoteMap = Map<string, { price: number; change: number; pct: number; loading: boolean; error?: boolean }>;

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  readonly positions = signal<Position[]>(this._load());
  private readonly _quotes = signal<QuoteMap>(new Map());
  readonly quotes = this._quotes.asReadonly();

  readonly rows = computed<PositionRow[]>(() =>
    this.positions().map(p => {
      const q = this._quotes().get(p.ticker) ?? null;
      const price = q && !q.loading ? q.price : null;
      const value  = price !== null ? price * p.qty : null;
      const pnl    = price !== null ? (price - p.pru) * p.qty : null;
      const pnlPct = price !== null && p.pru > 0 ? ((price - p.pru) / p.pru) * 100 : null;
      return { ...p, quote: q, value, pnl, pnlPct };
    })
  );

  readonly stats = computed<PortfolioStats>(() => {
    let totalValue = 0, totalCost = 0, hasData = false;
    for (const p of this.positions()) {
      const q = this._quotes().get(p.ticker);
      if (!q || q.loading) continue;
      totalValue += q.price * p.qty;
      totalCost  += p.pru   * p.qty;
      hasData = true;
    }
    const totalPnl    = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    return { totalValue, totalCost, totalPnl, totalPnlPct, hasData };
  });

  private _load(): Position[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
  }

  private _save(): void {
    localStorage.setItem(LS_KEY, JSON.stringify(this.positions()));
  }

  addPosition(ticker: string, qty: number, pru: number): void {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    this.positions.update(list => [...list, { id, ticker: ticker.toUpperCase().trim(), qty, pru }]);
    this._save();
  }

  removePosition(id: string): void {
    this.positions.update(list => list.filter(p => p.id !== id));
    this._save();
  }

  setQuoteLoading(ticker: string): void {
    this._quotes.update(m => {
      const next = new Map(m);
      next.set(ticker, { ...(m.get(ticker) ?? { price: 0, change: 0, pct: 0 }), loading: true });
      return next;
    });
  }

  setQuote(ticker: string, data: { price: number; change: number; pct: number }): void {
    this._quotes.update(m => {
      const next = new Map(m);
      next.set(ticker, { ...data, loading: false });
      return next;
    });
  }
}

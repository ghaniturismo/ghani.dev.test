export interface Position {
  id: string;
  ticker: string;
  qty: number;
  pru: number;
}

export interface Quote {
  price: number;
  change: number;
  pct: number;
  loading: boolean;
  error?: boolean;
}

export interface PositionRow extends Position {
  quote: Quote | null;
  value: number | null;
  pnl: number | null;
  pnlPct: number | null;
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPct: number;
  hasData: boolean;
}

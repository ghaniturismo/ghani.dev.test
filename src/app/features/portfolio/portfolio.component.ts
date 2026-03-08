import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PortfolioService } from '../../core/services/portfolio.service';
import { QuoteService } from '../../core/services/quote.service';
import { HeaderComponent } from './components/header/header.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { AddPositionFormComponent, AddPositionEvent } from './components/add-position-form/add-position-form.component';
import { PositionsTableComponent } from './components/positions-table/positions-table.component';
import { AiAnalysisComponent } from './components/ai-analysis/ai-analysis.component';

export type ActiveView = 'portfolio' | 'ai';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule,
    HeaderComponent,
    DashboardStatsComponent,
    AddPositionFormComponent,
    PositionsTableComponent,
    AiAnalysisComponent,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit, OnDestroy {
  readonly portfolioService = inject(PortfolioService);
  private readonly quoteService = inject(QuoteService);
  private readonly snackBar = inject(MatSnackBar);

  activeView  = signal<ActiveView>('portfolio');
  lastUpdate  = signal('En attente…');
  apiKeyInput = this.quoteService.apiKey();
  apiKeySaved = signal(false);
  private refreshInterval?: ReturnType<typeof setInterval>;

  readonly navItems = [
    { id: 'portfolio' as ActiveView, icon: 'bar_chart',     label: 'Portfolio'    },
    { id: 'ai'        as ActiveView, icon: 'auto_awesome',  label: 'Analyse IA'   },
  ];

  ngOnInit(): void {
    this.refreshAll();
    this.refreshInterval = setInterval(() => this.refreshAll(), 30_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  async onAdd(event: AddPositionEvent): Promise<void> {
    this.portfolioService.addPosition(event.ticker, event.qty, event.pru);
    this.snackBar.open(`${event.ticker.toUpperCase()} ajouté au portefeuille ✓`, '✕', {
      duration: 3000, panelClass: 'snack-success',
    });
    await this.refreshAll();
  }

  async refreshAll(): Promise<void> {
    const positions = this.portfolioService.positions();
    if (!positions.length) return;
    this.lastUpdate.set('Actualisation…');
    const tickers = [...new Set(positions.map(p => p.ticker))];
    await Promise.all(tickers.map(async ticker => {
      this.portfolioService.setQuoteLoading(ticker);
      const quote = await this.quoteService.fetchQuote(ticker);
      this.portfolioService.setQuote(ticker, quote);
    }));
    this.lastUpdate.set(
      'Mis à jour ' +
      new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  }

  saveApiKey(): void {
    this.quoteService.saveApiKey(this.apiKeyInput);
    this.apiKeySaved.set(true);
    this.snackBar.open('Clé API sauvegardée ✓', '✕', { duration: 2500, panelClass: 'snack-success' });
    setTimeout(() => this.apiKeySaved.set(false), 2500);
    this.refreshAll();
  }
}

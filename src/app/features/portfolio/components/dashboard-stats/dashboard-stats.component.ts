import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioStats } from '../../../../core/models/position.model';
import { SignedCurrencyPipe, SignedPctPipe, Currency2Pipe } from '../../../../shared/pipes/format.pipes';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [MatCardModule, MatIconModule, SignedCurrencyPipe, SignedPctPipe, Currency2Pipe],
  template: `
    <div class="stats-grid">
      <mat-card class="stat-card fade-slide-in">
        <mat-card-content>
          <div class="stat-card__label">
            <mat-icon>account_balance_wallet</mat-icon>
            Valeur totale
          </div>
          <div class="stat-card__value">
            {{ stats().hasData ? (stats().totalValue | currency2) : '–' }}
          </div>
          <div class="stat-card__sub">Portefeuille actuel</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card fade-slide-in" [class.stat-card--up]="stats().totalPnl >= 0 && stats().hasData"
                                                [class.stat-card--down]="stats().totalPnl < 0 && stats().hasData">
        <mat-card-content>
          <div class="stat-card__label">
            <mat-icon>trending_up</mat-icon>
            Plus-value latente
          </div>
          <div class="stat-card__value" [class.text-green]="stats().totalPnl >= 0 && stats().hasData"
                                        [class.text-red]="stats().totalPnl < 0 && stats().hasData">
            {{ stats().hasData ? (stats().totalPnl | signedCurrency) : '–' }}
          </div>
          <div class="stat-card__sub">P&amp;L non réalisé</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card fade-slide-in" [class.stat-card--up]="stats().totalPnlPct >= 0 && stats().hasData"
                                                [class.stat-card--down]="stats().totalPnlPct < 0 && stats().hasData">
        <mat-card-content>
          <div class="stat-card__label">
            <mat-icon>percent</mat-icon>
            Performance globale
          </div>
          <div class="stat-card__value" [class.text-green]="stats().totalPnlPct >= 0 && stats().hasData"
                                        [class.text-red]="stats().totalPnlPct < 0 && stats().hasData">
            {{ stats().hasData ? (stats().totalPnlPct | signedPct) : '–' }}
          </div>
          <div class="stat-card__sub">Depuis le PRU moyen</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './dashboard-stats.component.scss',
})
export class DashboardStatsComponent {
  stats = input.required<PortfolioStats>();
}

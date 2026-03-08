import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PositionRow } from '../../../../core/models/position.model';
import { Currency2Pipe, Num2Pipe, SignedCurrencyPipe, SignedPctPipe } from '../../../../shared/pipes/format.pipes';

@Component({
  selector: 'app-positions-table',
  standalone: true,
  imports: [
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
    Currency2Pipe, Num2Pipe, SignedCurrencyPipe, SignedPctPipe,
  ],
  templateUrl: './positions-table.component.html',
  styleUrl: './positions-table.component.scss',
})
export class PositionsTableComponent {
  rows     = input.required<PositionRow[]>();
  refresh  = output<void>();
  delete   = output<string>();

  readonly columns = ['ticker', 'qty', 'pru', 'price', 'dayChange', 'value', 'pnl', 'actions'];

  onDelete(id: string): void {
    if (confirm('Supprimer cette position ?')) this.delete.emit(id);
  }

  pnlClass(pnl: number | null): string {
    if (pnl === null) return '';
    return pnl >= 0 ? 'text-green' : 'text-red';
  }
}

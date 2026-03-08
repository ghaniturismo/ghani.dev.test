import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AddPositionEvent {
  ticker: string;
  qty: number;
  pru: number;
}

@Component({
  selector: 'app-add-position-form',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './add-position-form.component.html',
  styleUrl: './add-position-form.component.scss',
})
export class AddPositionFormComponent {
  addPosition = output<AddPositionEvent>();

  ticker = '';
  qty: number | null = null;
  pru: number | null = null;
  error = signal('');

  onSubmit(): void {
    if (!this.ticker.trim())           return this.error.set('Le ticker est requis.');
    if (!this.qty || this.qty <= 0)    return this.error.set('La quantité doit être > 0.');
    if (!this.pru || this.pru <= 0)    return this.error.set('Le PRU doit être > 0.');

    this.error.set('');
    this.addPosition.emit({ ticker: this.ticker.trim(), qty: this.qty, pru: this.pru });
    this.ticker = '';
    this.qty = null;
    this.pru = null;
  }
}

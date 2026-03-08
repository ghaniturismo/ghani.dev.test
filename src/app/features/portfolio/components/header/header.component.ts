import { Component, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar class="toolbar">
      <div class="toolbar__brand">
        <div class="toolbar__logo">P</div>
        <span class="toolbar__title">PortfolioTracker</span>
      </div>
      <div class="toolbar__status">
        <span class="live-dot"></span>
        <span class="toolbar__update">{{ lastUpdate() }}</span>
      </div>
    </mat-toolbar>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  lastUpdate = input<string>('En attente…');
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AiAnalysisService, ANALYSIS_PROMPTS, AnalysisPrompt } from '../../../../core/services/ai-analysis.service';

@Component({
  selector: 'app-ai-analysis',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  templateUrl: './ai-analysis.component.html',
  styleUrl: './ai-analysis.component.scss',
})
export class AiAnalysisComponent {
  protected readonly aiService = inject(AiAnalysisService);

  readonly prompts       = ANALYSIS_PROMPTS;
  ticker                 = signal('');
  selectedPrompt         = signal<AnalysisPrompt>(ANALYSIS_PROMPTS[0]);
  result                 = signal('');
  loading                = signal(false);
  error                  = signal('');

  // Clé Gemini
  geminiKeyInput         = this.aiService.geminiKey();
  geminiKeySaved         = signal(false);
  showKeySetup           = signal(!this.aiService.geminiKey());

  selectPrompt(p: AnalysisPrompt): void {
    this.selectedPrompt.set(p);
    this.result.set('');
    this.error.set('');
  }

  saveGeminiKey(): void {
    this.aiService.saveGeminiKey(this.geminiKeyInput);
    this.geminiKeySaved.set(true);
    this.showKeySetup.set(false);
    setTimeout(() => this.geminiKeySaved.set(false), 2000);
  }

  async analyze(): Promise<void> {
    if (!this.aiService.geminiKey()) {
      this.showKeySetup.set(true);
      this.error.set('Veuillez configurer votre clé API Gemini.');
      return;
    }
    const t = this.ticker().trim().toUpperCase();
    if (!t) { this.error.set('Veuillez saisir un ticker.'); return; }

    this.loading.set(true);
    this.result.set('');
    this.error.set('');

    try {
      const text = await this.aiService.analyze(this.selectedPrompt().build(t));
      this.result.set(text);
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg === 'NO_KEY') {
        this.error.set('Clé API Gemini manquante. Configurez-la ci-dessus.');
        this.showKeySetup.set(true);
      } else {
        this.error.set(`Erreur : ${msg}`);
      }
    } finally {
      this.loading.set(false);
    }
  }

  /** Markdown basique → HTML */
  formatResult(raw: string): string {
    return raw
      .replace(/^### (.+)$/gm,  '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,   '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/^[•\-*] (.+)$/gm,'<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g,   '<br>');
  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currency2', standalone: true })
export class Currency2Pipe implements PipeTransform {
  transform(value: number | null, currency = 'USD'): string {
    if (value === null) return '–';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency,
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(value);
  }
}

@Pipe({ name: 'num2', standalone: true })
export class Num2Pipe implements PipeTransform {
  transform(value: number | null, digits = 2): string {
    if (value === null) return '–';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }
}

@Pipe({ name: 'signedCurrency', standalone: true })
export class SignedCurrencyPipe implements PipeTransform {
  transform(value: number | null, currency = 'USD'): string {
    if (value === null) return '–';
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency,
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Math.abs(value));
    return (value >= 0 ? '+' : '−') + formatted;
  }
}

@Pipe({ name: 'signedPct', standalone: true })
export class SignedPctPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null) return '–';
    const abs = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Math.abs(value));
    return (value >= 0 ? '+' : '−') + abs + ' %';
  }
}


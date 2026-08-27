import { Pipe, PipeTransform } from '@angular/core';

/**
 * Muestra una dirección de wallet acortada, ej:
 * 0x1234567890abcdef1234567890abcdef12345678 -> 0x1234...5678
 */
@Pipe({
  name: 'shortAddress',
  standalone: true,
})
export class ShortAddressPipe implements PipeTransform {
  transform(value: string | null | undefined, chars = 4): string {
    if (!value) return '';
    if (value.length <= chars * 2 + 2) return value;
    return `${value.slice(0, chars + 2)}...${value.slice(-chars)}`;
  }
}

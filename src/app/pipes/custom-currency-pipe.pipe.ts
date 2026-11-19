import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null || isNaN(Number(value))) {
      return '$0.00';
    }

    const numberValue = Number(value);

    const formatted = numberValue
      .toFixed(2)  
      .replace(/\B(?=(\d{3})+(?!\d))/g, ','); 

    return `$${formatted}`;
  }
}

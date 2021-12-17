import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readyNo'
})
export class ReadyNoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value ? "Готово" : "Не готово ещё";
  }

}

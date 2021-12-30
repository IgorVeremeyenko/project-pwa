import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readyNo'
})
export class ReadyNoPipe implements PipeTransform {

  transform(value: unknown, date: unknown): unknown {
    return value ? "Выполнено": "Не готово ещё";
  }

}

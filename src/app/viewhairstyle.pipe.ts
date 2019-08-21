import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewhairstyle'
})
export class ViewhairstylePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from '../../model/entry';

/**
 * Generated class for the OrderByPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  compare(a: Entry , b: Entry) {
    if (a.timeStamp < b.timeStamp)
      return 1;
    if (a.timeStamp > b.timeStamp)
      return -1;
    return 0;
  }

  transform(input: Array<any>, args: string) : Array<any> {
    return input.sort(this.compare);
  }
}
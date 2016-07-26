import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  pure: false
})

export class FilterByPipe implements PipeTransform {
  transform(list: any[], filter: any): any {
    if (!list) return [];
    return list.filter(item=>{
      return item.name.toLowerCase()
              .indexOf(filter.byName.toLowerCase()) !== -1 &&
             (!filter.byPower || item.power === filter.byPower)
    })
  }
}

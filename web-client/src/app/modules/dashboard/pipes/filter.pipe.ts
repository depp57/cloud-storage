import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '@modules/dashboard/models/item';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Item[] | null, searchText: string | null): Item[] {
    if (items === null) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    // case insensitive
    searchText = searchText.toLowerCase();

    return this.filterByName(items, searchText);
  }

  private filterByName(items: Item[], searchText: string): Item[] {
    return items.filter(item => item.name.toLowerCase().includes(searchText));
  }
}

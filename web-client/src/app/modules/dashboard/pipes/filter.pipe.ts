import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '@modules/dashboard/models/items';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform<T extends Item>(items: T[] | null, searchText: string | null): T[] {
    if (items === null) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    // case insensitive
    searchText = searchText.toLowerCase();

    return FilterPipe.filterByName(items, searchText);
  }

  private static filterByName<T extends Item>(items: T[], searchText: string): T[] {
    return items.filter(item => item.fullName.toLowerCase().includes(searchText));
  }
}

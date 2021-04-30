import { Injectable } from '@angular/core';
import { File, Folder, Item } from '@modules/dashboard/models/items';
import { ResponseDelete, ResponseList, ResponseUpdate, ApiFileType } from '@modules/dashboard/models/api-files';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';

@Injectable({
  providedIn: 'root'
})
export class FilesRepositoryService {

  private _files: File[] = [];
  private _folders: Folder[] = [];
  private _searchText?: string;

  constructor(private filesApi: FilesApiService) {}

  get files(): File[] {
    return this._files;
  }

  get folders(): Folder[] {
    return this._folders;
  }

  get searchText(): string | undefined {
    return this._searchText;
  }

  listFolder(folderName: string): Observable<ResponseList> {
    return this.filesApi.listDir({path: folderName}).pipe(
      tap(response => this.saveFiles(response))
    );
  }

  rename(item: Item, newName: {name: string, extension?: string}): Observable<ResponseUpdate> {
    return this.filesApi.update({fullPath: item.name, newFullPath: newName.name + newName.extension}).pipe(
      tap(response => {
        if (response.changed) {
          this.renameItem(item, newName);
        }
      })
    );
  }

  delete(item: Item): Observable<ResponseDelete> {
    return this.filesApi.delete({fullPath: item.name}).pipe(
      tap(response => {
        if (response.deleted) {
          this.deleteItem(item);
        }
      })
    );
  }

  searchByText(text?: string): void {
    this._searchText = text;
  }

  private saveFiles(response: ResponseList): void {
    for (const file of response.files) {
      const fileName = FilesRepositoryService.extractFileName(file.fullPath);

      if (file.type === ApiFileType.FILE) {
        this._files.push(File.fromNameWithExtension(fileName));
      }
      else {
        this._folders.push(new Folder(fileName));
      }
    }

    this.sortByName();
  }

  private sortByName(): void {
    this._files.sort((a, b) => a.compareTo(b));
    this._folders.sort((a, b) => a.compareTo(b));
  }

  private deleteItem(item: Item): void {
    function deleteIn<T extends Item>(items: T[]): void {
      const index = FilesRepositoryService.findItem(items, item);

      // delete the element
      if (index !== -1) { items.splice(index, 1); }
    }

    item.isFile() ? deleteIn(this._files) : deleteIn(this._folders);
  }

  private renameItem(item: Item, newName: { name: string, extension?: string }): void {
    function renameIn<T extends Item>(items: T[]): void {
      const index = FilesRepositoryService.findItem(items, item);

      if (index !== -1) { items[index].rename(newName.name, newName.extension); }
    }

    item.isFile() ? renameIn(this._files) : renameIn(this._folders);
  }

  private static findItem<T extends Item>(items: T[], item: T): number {
    // although the array is sorted, it is faster to use Array.findIndex() that
    // a custom binary search (I tested it with multiple array's sizes)
    return items.findIndex((value) => value.equals(item));
  }

  private static extractFileName(fullPath: string): string {
    const split = fullPath.split('/');
    return split[split.length - 1];
  }
}

import { Injectable } from '@angular/core';
import { File, Folder, Item } from '@modules/dashboard/models/items';
import { ResponseDelete, ResponseList, ResponseUpdate, ApiFileType } from '@modules/dashboard/models/api-files';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';
import { PathService } from '@modules/dashboard/services/path.service';

@Injectable({
  providedIn: 'root'
})
export class FilesRepositoryService {

  private readonly _files$     = new BehaviorSubject<File[]>([]);
  private readonly _folders$    = new BehaviorSubject<Folder[]>([]);
  private readonly _searchText$ = new Subject<string>();

  constructor(private filesApi: FilesApiService,
              private path: PathService) {}

  get files$(): Observable<File[]> {
    return this._files$.asObservable();
  }

  get folders$(): Observable<Folder[]> {
    return this._folders$.asObservable();
  }

  get searchText$(): Subject<string> {
    return this._searchText$;
  }

  // the path can be relative (myDocuments) or absolute (/myDocuments)
  listFolder(path: string): Observable<ResponseList> {
    this.path.updatePath(path);

    return this.filesApi.listDir({fullPath: this.path.currentPath$.value}).pipe(
      tap(response => this.saveFiles(response))
    );
  }

  rename(item: Item, newName: { name: string, extension?: string }): Observable<ResponseUpdate> {
    const currentPath = this.path.currentPath$.value;

    return this.filesApi.update({
      fullPath: currentPath + item.fullName,
      newFullPath: currentPath + newName.name + newName.extension
    }).pipe(
      tap(response => {
        if (response.changed) {
          this.renameItem(item, newName);
        }
      })
    );
  }

  delete(item: Item): Observable<ResponseDelete> {
    const currentPath = this.path.currentPath$.value;

    return this.filesApi.delete({fullPath: currentPath + item.fullName}).pipe(
      tap(response => {
        if (response.deleted) {
          this.deleteItem(item);
        }
      })
    );
  }

  move(item: Item, newPath: string): Observable<ResponseUpdate> {
    const currentPath = this.path.currentPath$.value;

    return this.filesApi.move({
      fullPath: currentPath + item.fullName,
      newFullPath: `${currentPath + newPath}/${item.fullName}`
    }).pipe(
      tap(response => {
        if (response.changed) {
          this.moveItem(item);
        }
      })
    );
  }

  searchByText(text?: string): void {
    this._searchText$.next(text);
  }

  private saveFiles(response: ResponseList): void {
    const files: File[]     = [];
    const folders: Folder[] = [];

    for (const file of response.files) {
      const fileName = FilesRepositoryService.extractFileName(file.fullPath);

      if (file.type === ApiFileType.FILE) {
        files.push(File.fromNameWithExtension(fileName));
      }
      else {
        folders.push(new Folder(fileName));
      }
    }
    FilesRepositoryService.sortByName(files, folders);

    this._files$.next(files);
    this._folders$.next(folders);
  }

  private deleteItem(item: Item): void {
    function deleteIn<T extends Item>(subject: BehaviorSubject<T[]>): void {
      const items = subject.value;

      const index = items.findIndex(current => current.equals(item));
      if (index !== -1) { items.splice(index, 1); }

      subject.next(items);
    }

    item.isFile() ? deleteIn(this._files$) : deleteIn(this._folders$);
  }

  private renameItem(item: Item, newName: { name: string, extension?: string }): void {
    function renameIn(subject: BehaviorSubject<any[]>): void {
      const items = subject.value;

      const index = items.findIndex(current => current.equals(item));
      if (index !== -1) { items[index] = items[index].rename(newName); }

      subject.next(items);
    }

    item.isFile() ? renameIn(this._files$) : renameIn(this._folders$);
  }

  private moveItem(item: Item): void {
    // because only items in current folder are visible, move an item to another folder is like delete in the front-end
    this.deleteItem(item);
  }

  private static sortByName(files: File[], folders: Folder[]): void {
    files.sort((a, b) => a.compareTo(b));
    folders.sort((a, b) => a.compareTo(b));
  }

  private static extractFileName(fullPath: string): string {
    const split = fullPath.split('/');
    return split[split.length - 1];
  }
}

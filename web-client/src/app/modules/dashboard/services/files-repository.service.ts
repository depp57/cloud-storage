import { Injectable } from '@angular/core';
import { File, Folder, Item } from '@modules/dashboard/models/items';
import { ApiFileType, ResponseDelete, ResponseList, ResponseUpdate } from '@modules/dashboard/models/api-files';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';
import { PathService } from '@modules/dashboard/services/path.service';
import { TreeNode } from '@modules/utils/folder-tree/model/tree-node';

@Injectable({
  providedIn: 'root'
})
export class FilesRepositoryService {

  private readonly _files$      = new BehaviorSubject<File[]>([]);
  private readonly _folders$    = new BehaviorSubject<Folder[]>([]);
  private readonly _searchText$ = new Subject<string>();

  constructor(private filesApi: FilesApiService,
              private path: PathService) {}

  get files$(): Observable<File[]> {
    return this._files$;
  }

  get folders$(): Observable<Folder[]> {
    return this._folders$;
  }

  get searchText$(): Observable<string> {
    return this._searchText$;
  }

  // the path can be relative (myDocuments) or absolute (/myDocuments)
  listFolder(filePath: string): Observable<ResponseList> {
    this.path.updatePath(filePath);

    return this.filesApi.listDir({filePath}).pipe(
      tap(response => this.saveFiles(response))
    );
  }

  getSubFolders(folder: Folder): Observable<TreeNode> {
    return this.filesApi.listDir({filePath: folder.filePath}).pipe(
      map(response => {
        const responseFolders        = response.result.filter(item => item.type === ApiFileType.DIR);
        const subFolders: TreeNode[] = responseFolders.map(dir => ({folder: new Folder(dir.filePath)}));
        subFolders.sort((a, b) => a.folder.compareTo(b.folder));

        // TODO IT DOESNT WORK NOW WITH FULL PATH BECAUSE OF FAKE-API, BUT IT WILL WITH THE REAL ONE
        return {folder, subFolders};
      })
    );
  }

  rename(item: Item, newFilePath: string): Observable<ResponseUpdate> {
    if (item.filePath === newFilePath) {
      return of({changed: false});
    }

    return this.filesApi.update({
      filePath: item.filePath,
      newFilePath
    }).pipe(
      tap(response => {
        if (response.changed) {
          this.renameItem(item, newFilePath);
        }
      })
    );
  }

  delete(item: Item): Observable<ResponseDelete> {
    return this.filesApi.delete({filePath: item.filePath}).pipe(
      tap(response => {
        if (response.deleted) {
          this.deleteItem(item);
        }
      })
    );
  }

  move(item: Item, newFilePath: string): Observable<ResponseUpdate> {
    if (item.filePath === newFilePath) {
      return of({changed: false});
    }

    return this.filesApi.move({
      filePath: item.filePath,
      newFilePath
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

    for (const file of response.result) {
      if (file.type === ApiFileType.FILE) {
        files.push(new File(file.filePath));
      }
      else {
        folders.push(new Folder(file.filePath));
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

  private renameItem(item: Item, newFilePath: string): void {
    function renameIn(subject: BehaviorSubject<any[]>): void {
      const items = subject.value;

      const index = items.findIndex(current => current.equals(item));
      if (index !== -1) {
        if (items[index].isFile()) {
          items[index] = new File(newFilePath);
        }
        else {
          items[index] = new Folder(newFilePath);
        }
      }

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
}

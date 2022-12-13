import { Injectable } from '@angular/core';
import { Item, File, Folder } from '@modules/dashboard/models/item';
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

  private readonly _items$      = new BehaviorSubject<Item[]>([]);
  private readonly _searchText$ = new Subject<string>();

  constructor(private filesApi: FilesApiService,
              private path: PathService) {}

  get files$(): Observable<Item[]> {
    return this._items$;
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

  private saveFiles(response: ResponseList): void {
    const files: Item[]     = [];

    for (const file of response.result) {
      if (file.type === ApiFileType.FILE) {
        files.push(new File(file.filePath));
      }
      else {
        files.push(new Folder(file.filePath));
      }
    }
    
    this.sortByName(files);

    this._items$.next(files);
  }

  getSubFolders(folder: Folder): Observable<TreeNode> {
    return this.filesApi.listDir({filePath: folder.path}).pipe(
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
    if (item.path === newFilePath) {
      return of({changed: false});
    }

    return this.filesApi.update({
      path: item.path,
      newPath: newFilePath
    }).pipe(
      tap(response => {
        if (response.changed) {
          this.renameItem(item, newFilePath);
        }
      })
    );
  }

  delete(item: Item): Observable<ResponseDelete> {
    return this.filesApi.delete({filePath: item.path}).pipe(
      tap(response => {
        if (response.deleted) {
          this.deleteItem(item);
        }
      })
    );
  }

  move(item: Item, newFilePath: string): Observable<ResponseUpdate> {
    if (item.path === newFilePath) {
      return of({changed: false});
    }

    return this.filesApi.move({
      path: item.path,
      newPath: newFilePath
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

  private deleteItem(item: Item): void {
    const items = this._items$.value;

     const index = items.findIndex(current => current.equals(item));
     if (index !== -1) { items.splice(index, 1); }

     this._items$.next(items);
  }

  private renameItem(target: Item, newFilePath: string): void {
    const files = this._items$.value;

    const index = files.findIndex(current => current.equals(target));
    if (index !== -1) {
      files[index] = files[index].rename(newFilePath);
    }

    this._items$.next(files);
  }

  private moveItem(file: Item): void {
    // because only items in current folder are visible, move a file to another folder is like delete in the front-end
    this.deleteItem(file);
  }

  private sortByName(files: Item[]): void {
    files.sort((a, b) => a.compareTo(b));
  }
}

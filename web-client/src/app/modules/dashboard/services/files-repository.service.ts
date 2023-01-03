import {Injectable} from '@angular/core';
import { Item, File, Folder } from '@models/item';
import { ApiFileType, ResponseList } from '@models/api-files';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';
import { PathService } from '@modules/dashboard/services/path.service';
import { TreeNode } from '@modules/shared/folder-tree/model/tree-node';
import { PATH_SEPARATOR } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FilesRepositoryService {

  private readonly _items$      = new BehaviorSubject<Item[]>([]);
  private readonly _searchText$ = new Subject<string>();

  constructor(private filesApi: FilesApiService, private path: PathService) {}

  get files$(): Observable<Item[]> {
    return this._items$;
  }

  get searchText$(): Observable<string> {
    return this._searchText$;
  }

  // the path can be relative (myDocuments) or absolute (/myDocuments)
  checkDirectory(filePath: string): Observable<ResponseList> {
    this.path.updatePath(filePath);

    return this.filesApi.listDir({filePath}).pipe(
      tap(response => {
        this.saveFiles(response);
      })
    );
  }

  filterByText(text?: string): void {
    this._searchText$.next(text);
  }

  getSubFolders(folder: Folder): Observable<TreeNode> {
    return this.filesApi.listDir({filePath: folder.path}).pipe(
      map(response => {
        const responseFolders        = response.result.filter(item => item.type === ApiFileType.DIR);
        const subFolders: TreeNode[] = responseFolders.map(dir => ({folder: new Folder(dir.path)}));
        subFolders.sort((a, b) => a.folder.compareTo(b.folder));

        // TODO IT DOESNT WORK NOW WITH FULL PATH BECAUSE OF FAKE-API, BUT IT WILL WITH THE REAL ONE
        return {folder, subFolders};
      })
    );
  }

  createDirectory(name: string): void {
    if (name === '') {
      return;
    }

    const path = this.path.currentPath$.getValue();

    this.filesApi.createDir({
      path,
      name,
      type: ApiFileType.DIR
    }).subscribe(
      () => {
        if (path === '/') {
          this.addItem(new Folder(path + name));
        } else {
          this.addItem(new Folder(path + PATH_SEPARATOR + name));
        }
      }
    );
  }

  rename(item: Item, newFilePath: string): void {
    if (item.path === newFilePath) {
      return;
    }

    this.filesApi.rename({
      path: item.path,
      newPath: newFilePath
    }).subscribe(
      () => this.renameItem(item, newFilePath)
    );
  }

  move(item: Item, newFilePath: string): void {
    if (item.path === newFilePath) {
      return;
    }

    this.filesApi.move({
      path: item.path,
      newPath: newFilePath
    }).subscribe(
      () => this.renameItem(item, newFilePath)
    );
  }

  delete(item: Item): void {
    this.filesApi.delete({filePath: item.path}).subscribe(
      () => this.deleteItem(item)
    );
  }

  private saveFiles(response: ResponseList): void {
    const files: Item[]     = [];

    for (const file of response.result) {
      if (file.type === ApiFileType.FILE) {
        files.push(new File(file.path));
      }
      else {
        files.push(new Folder(file.path));
      }
    }

    this.sortByName(files);

    this._items$.next(files);
  }

  private addItem(item: Item): void {
    const items = this._items$.value;

    items.push(item);

    this._items$.next(items);
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

  private sortByName(files: Item[]): void {
    files.sort((a, b) => a.compareTo(b));
  }
}

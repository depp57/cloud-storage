import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Folder } from '@modules/dashboard/models/item';

@Injectable({
  providedIn: 'root'
})
export class FolderTreeService {
  private _selectedFolder = new Subject<Folder>();

  get selectedFolder(): Observable<Folder> {
    return this._selectedFolder;
  }

  selectFolder(folder: Folder): void {
    this._selectedFolder.next(folder);
  }
}

import { Injectable } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { Folder, Item } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DialogService } from '@modules/utils/dialog/service/dialog.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemLogic {

  private _onMove$ = new Subject<Item | null>();

  constructor(private filesRepo: FilesRepositoryService,
              private dialog: DialogService) {}

  get onMove$(): Observable<Item | null> {
    return this._onMove$;
  }

  getItemsContextMenu(item: Item): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.downloadItem(item)},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.deleteItem(item)},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.moveItem(item)},
      {text: 'Renommer', icon: 'edit', onClick: () => this.renameItem(item)}
    ];
  }

  moveItemWithoutDialog(item: Item, newPath: string): void {
    this.filesRepo.move(item, newPath).subscribe();
  }

  listFolder(folder: Folder): void {
    this.filesRepo.listFolder(folder.filePath).subscribe();
  }

  dontMoveItem(): void {
    this._onMove$.next(null);
  }

  private downloadItem(item: Item): void {
    console.log(`Télécharger : ${item.fullName} (${item.extension})`);
    return undefined;
  }

  private deleteItem(item: Item): void {
    this.dialog.openDeleteDialog(item).subscribe(
      needDelete => {
        if (needDelete) {
          this.filesRepo.delete(item).subscribe();
        }
      }
    );
  }

  private moveItem(item: Item): void {
    this._onMove$.next(item);
  }

  private renameItem(item: Item): void {
    this.dialog.openRenameDialog(item).subscribe(
      newFilePath => {
        if (newFilePath) {
          this.filesRepo.rename(item, newFilePath).subscribe();
        }
      }
    );
  }
}

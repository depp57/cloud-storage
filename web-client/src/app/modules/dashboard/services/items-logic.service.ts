import { Injectable } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { Folder, Item } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DialogService } from '@modules/utils/dialog/service/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class FilesExplorerLogic {

  constructor(private filesRepo: FilesRepositoryService,
              private dialog: DialogService) {}

  getItemsContextMenu(item: Item): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.downloadItem(item)},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.deleteItem(item)},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.moveItem(item)},
      {text: 'Renommer', icon: 'edit', onClick: () => this.renameItem(item)},
    ];
  }

  moveItemWithoutDialog(item: Item, newPath: string): void {
    this.filesRepo.move(item, newPath).subscribe();
  }

  listFolder(folder: Folder): void {
    this.filesRepo.listFolder(folder.name).subscribe();
  }

  private downloadItem(item: Item): void {
    console.log(`Télécharger : ${item.name} (${item.extension})`);
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
    console.warn(`Déplacer : ${item.fullName}
     -- need le back-end pour lister les items dans les dossiers/sous dossiers`);

    // this.filesRepo.move(item).subscribe();
  }

  private renameItem(item: Item): void {
    this.dialog.openRenameDialog(item).subscribe(
      newName => {
        if (newName) {
          this.filesRepo.rename(item, newName).subscribe();
        }
      }
    );
  }
}

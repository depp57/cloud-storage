import { Injectable } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { Item } from '@modules/dashboard/models/items';
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

  private downloadItem(item: Item): void {
    console.log(`Télécharger : ${item.name} (${item.extension})`);
    return undefined;
  }

  private deleteItem(item: Item): void {
    console.log(`Supprimer : ${item.name} (${item.extension})`);

    this.dialog.openDeleteDialog(item).subscribe(
      needDelete => {
        if (needDelete) {
          this.filesRepo.delete(item).subscribe();
        }
      }
    );
  }

  private moveItem(item: Item): void {
    console.log(`Déplacer : ${item.name} (${item.extension})`);
  }

  private renameItem(item: Item): void {
    console.log(`Renommer : ${item.name} (${item.extension})`);

    this.dialog.openRenameDialog(item).subscribe(
      newName => {
        if (newName) {
          this.filesRepo.rename(item, {name: newName.name, extension: newName.extension}).subscribe();
        }
      }
    );
  }
}

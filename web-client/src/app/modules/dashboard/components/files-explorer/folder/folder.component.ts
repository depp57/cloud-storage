import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Item, Folder } from '@models/item';
import { MenuButton } from '@modules/shared/context-menu/model/menu-button';
import { DATA_TRANSFER_NAME } from '@models/drag-and-drop';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { DialogService } from '@modules/shared/dialog/service/dialog.service';
import { PATH_SEPARATOR } from '@shared/constants';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderComponent {

  @Input() folder!: Item;
  @Output() moveFileEvent = new EventEmitter<Item | null>();

  constructor(private filesRepo: FilesRepositoryService, private dialog: DialogService) {}

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData(DATA_TRANSFER_NAME, this.folder.toJson());
  }

  onDragOver(event: DragEvent): void {
    // Tell the browser to let the user drop here
    event.preventDefault();
  }

  onDragDrop(event: DragEvent): void {
    if (event.dataTransfer?.getData(DATA_TRANSFER_NAME)) {
      event.preventDefault();

      const itemJson  = event.dataTransfer.getData(DATA_TRANSFER_NAME);
      const movedItem = Folder.fromJson(itemJson);

      this.filesRepo.move(movedItem, this.folder.path + PATH_SEPARATOR + movedItem.name);
    }
  }

  onClick(): void {
    this.filesRepo.checkDirectory(this.folder.path).subscribe();
  }

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.downloadItem(this.folder)},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.deleteItem(this.folder)},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.moveItem(this.folder)},
      {text: 'Renommer', icon: 'edit', onClick: () => this.renameItem(this.folder)}
    ];
  }

  private moveItem(item: Item): void {
    this.moveFileEvent.emit(item);
  }

  private downloadItem(item: Item): void {
    console.log(`Télécharger : ${item.path} (${item.extension})`);
    return undefined;
  }

  private deleteItem(file: Item): void {
    this.dialog.openDeleteDialog(file).subscribe(
      needDelete => {
        if (needDelete) {
          this.filesRepo.delete(file);
        }
      }
    );
  }

  private renameItem(file: Item): void {
    this.dialog.openRenameDialog(file).subscribe(
      newFilePath => {
        if (newFilePath) {
          this.filesRepo.rename(file, newFilePath);
        }
      }
    );
  }
}

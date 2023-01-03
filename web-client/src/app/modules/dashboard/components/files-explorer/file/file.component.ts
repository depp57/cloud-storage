import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '@models/item';
import { MenuButton } from '@modules/shared/context-menu/model/menu-button';
import { DATA_TRANSFER_NAME } from '@models/drag-and-drop';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { DialogService } from '@modules/shared/dialog/service/dialog.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

  @Input() file!: Item;
  @Output() moveFileEvent = new EventEmitter<Item | null>();

  constructor(private filesRepo: FilesRepositoryService, private dialog: DialogService) {}

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData(DATA_TRANSFER_NAME, this.file.toJson());
    }
  }

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.downloadItem(this.file)},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.deleteItem(this.file)},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.moveItem(this.file)},
      {text: 'Renommer', icon: 'edit', onClick: () => this.renameItem(this.file)}
    ];
  }

  private moveItem(item: Item): void {
    this.moveFileEvent.emit(item);
  }

  private downloadItem(item: Item): void {
    console.log(`Télécharger : ${item.path} (${item.extension})`);
    return undefined;
  }

  private deleteItem(item: Item): void {
    this.dialog.openDeleteDialog(item).subscribe(
      needDelete => {
        if (needDelete) {
          this.filesRepo.delete(item);
        }
      }
    );
  }

  private renameItem(item: Item): void {
    this.dialog.openRenameDialog(item).subscribe(
      newFilePath => {
        if (newFilePath) {
          this.filesRepo.rename(item, newFilePath);
        }
      }
    );
  }
}

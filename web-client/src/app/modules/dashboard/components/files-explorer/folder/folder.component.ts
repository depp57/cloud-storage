import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Folder, Item } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DATA_TRANSFER_NAME } from '@modules/dashboard/models/drag-and-drop';
import { ItemLogic } from '@modules/dashboard/services/item-logic.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderComponent {

  @Input() folder!: Folder;

  constructor(private folderLogic: ItemLogic) {}

  get contextMenuButtons(): MenuButton[] {
    return this.folderLogic.getItemsContextMenu(this.folder);
  }

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
      const movedItem = Item.fromJson(itemJson);

      this.folderLogic.moveItemWithoutDialog(movedItem, this.folder.fullPath + movedItem.fullName);
    }
  }

  onClick(): void {
    this.folderLogic.listFolder(this.folder);
  }
}

import { Component, Input } from '@angular/core';
import { Folder } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DATA_TRANSFER_FOLDER, DATA_TRANSFER_NAME, DATA_TRANSFER_TYPE } from '@modules/dashboard/models/drag-and-drop';
import { FilesExplorerLogic } from '@modules/dashboard/services/files-explorer-logic';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {

  @Input() folder!: Folder;

  constructor(private folderLogic: FilesExplorerLogic) {}

  get contextMenuButtons(): MenuButton[] {
    return this.folderLogic.getItemsContextMenu(this.folder);
  }

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData(DATA_TRANSFER_TYPE, DATA_TRANSFER_FOLDER);
    event.dataTransfer?.setData(DATA_TRANSFER_NAME, this.folder.name);
  }

  onDragOver(event: DragEvent): void {
    // Tell the browser to let the user drop here
    event.preventDefault();
  }

  onDragDrop(event: DragEvent): void {
    if (event.dataTransfer?.getData(DATA_TRANSFER_TYPE)) {
      event.preventDefault();

      const sourceName = event.dataTransfer.getData(DATA_TRANSFER_NAME);
      const sourceType = event.dataTransfer.getData(DATA_TRANSFER_TYPE);

      console.log(`(${sourceType}) ${sourceName} -> ${this.folder.name}`);
    }
  }
}

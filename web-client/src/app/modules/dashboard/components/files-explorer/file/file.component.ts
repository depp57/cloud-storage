import { Component, Input } from '@angular/core';
import { File } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DATA_TRANSFER_FILE, DATA_TRANSFER_NAME, DATA_TRANSFER_TYPE } from '@modules/dashboard/models/drag-and-drop';
import { FilesExplorerLogic } from '@modules/dashboard/services/files-explorer-logic';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {

  @Input() file!: File;

  constructor(private fileLogic: FilesExplorerLogic) {}

  get contextMenuButtons(): MenuButton[] {
    return this.fileLogic.getItemsContextMenu(this.file);
  }

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData(DATA_TRANSFER_TYPE, DATA_TRANSFER_FILE);
      event.dataTransfer.setData(DATA_TRANSFER_NAME, this.file.name);
    }
  }
}

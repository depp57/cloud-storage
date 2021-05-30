import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { File } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DATA_TRANSFER_NAME } from '@modules/dashboard/models/drag-and-drop';
import { ItemLogic } from '@modules/dashboard/services/item-logic.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

  @Input() file!: File;

  constructor(private fileLogic: ItemLogic) {}

  get contextMenuButtons(): MenuButton[] {
    return this.fileLogic.getItemsContextMenu(this.file);
  }

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData(DATA_TRANSFER_NAME, this.file.toJson());
    }
  }
}

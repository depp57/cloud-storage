import { Component, Input } from '@angular/core';
import { File } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { DATA_TRANSFER_FILE, DATA_TRANSFER_NAME, DATA_TRANSFER_TYPE } from '@modules/dashboard/models/drag-and-drop';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {
  @Input() file!: File;

  // TODO FIND A SOLUTION TO AVOID COPY PASTE FOLLOWING CODE FOR CONTEXT MENU (FILES AND FOLDER)

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.onDownload()},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.onDelete()},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.onMove()},
      {text: 'Renommer', icon: 'edit', onClick: () => this.onRename()},
    ];
  }

  onDownload(): void {
    console.log(`Télécharger le fichier : ${this.file.name} (${this.file.extension})`);
  }

  onDelete(): void {
    console.log(`Supprimer le fichier : ${this.file.name} (${this.file.extension})`);
  }

  onMove(): void {
    console.log(`Déplacer le fichier : ${this.file.name} (${this.file.extension})`);
  }

  onRename(): void {
    console.log(`Renommer le fichier : ${this.file.name} (${this.file.extension})`);
  }

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData(DATA_TRANSFER_TYPE, DATA_TRANSFER_FILE);
      event.dataTransfer.setData(DATA_TRANSFER_NAME, this.file.name);
    }
  }
}

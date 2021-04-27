import { Component, Input } from '@angular/core';
import { Folder } from '@modules/dashboard/models/folder';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  @Input() folder!: Folder;

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Télécharger', icon: 'download', onClick: () => this.onDownload()},
      {text: 'Supprimer', icon: 'delete', onClick: () => this.onDelete()},
      {text: 'Déplacer', icon: 'open_with', onClick: () => this.onMove()},
      {text: 'Renommer', icon: 'edit', onClick: () => this.onRename()},
    ];
  }

  onDownload(): void {
    console.log(`Télécharger le dossier : ${this.folder.name}`);
  }

  onDelete(): void {
    console.log(`Supprimer le dossier : ${this.folder.name}`);
  }

  onMove(): void {
    console.log(`Déplacer le dossier : ${this.folder.name}`);
  }

  onRename(): void {
    console.log(`Renommer le dossier : ${this.folder.name}`);
  }
}

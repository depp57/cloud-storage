import { Component } from '@angular/core';
import { FileService } from 'src/app/modules/dashboard/services/file.service';
import { File } from 'src/app/modules/dashboard/models/file';
import { Folder } from 'src/app/modules/dashboard/models/folder';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent {
  files: File[] = this.fileService.files;
  folders: Folder[] = this.fileService.folders;

  constructor(private fileService: FileService) {}

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Nouveau fichier', icon: 'add', onClick: () => this.onNewFile()},
      {text: 'Nouveau dossier', icon: 'add', onClick: () => this.onNewFolder()},
      {text: 'Charger un fichier(s)', icon: 'upload', onClick: () => this.onUploadFile()},
      {text: 'Charger un dossier', icon: 'upload', onClick: () => this.onUploadFolder()},
    ];
  }

  onNewFile(): void {
    console.log('Nouveau fichier');
  }

  onNewFolder(): void {
    console.log('Nouveau dossier');
  }

  onUploadFile(): void {
    console.log('Charger un fichier(s)');
  }

  onUploadFolder(): void {
    console.log('Charger un dossier');
  }
}

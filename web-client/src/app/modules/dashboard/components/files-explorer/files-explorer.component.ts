import { Component } from '@angular/core';
import { FileService } from 'src/app/modules/dashboard/services/file.service';
import { File } from 'src/app/modules/dashboard/models/file';
import { Folder } from 'src/app/modules/dashboard/models/folder';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent {
  files: File[] = this.fileService.files;
  folders: Folder[] = this.fileService.folders;

  constructor(private fileService: FileService) {}

}

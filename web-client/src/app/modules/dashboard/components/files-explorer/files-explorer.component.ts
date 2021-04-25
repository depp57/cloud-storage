import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/modules/dashboard/services/file.service';
import { File } from 'src/app/modules/dashboard/models/file';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent implements OnInit {
  files: File[] = this.fileService.getFiles();

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

}

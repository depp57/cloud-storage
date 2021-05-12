import { Component } from '@angular/core';
import { PathService } from '@modules/dashboard/services/path.service';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';

@Component({
  selector: 'app-current-path',
  templateUrl: './current-path.component.html',
  styleUrls: ['./current-path.component.scss']
})
export class CurrentPathComponent {

  separatedFolders!: string[];

  constructor(private path: PathService,
              private filesRepo: FilesRepositoryService) {
    this.path.currentPath.subscribe(
      _ => this.savePath()
    );
  }

  onClick(pathDepth: number): void {
    const newPath = this.separatedFolders
      .slice(0, pathDepth + 1)
      .reduce((previousValue, currentValue) => previousValue + currentValue + '/', '/');

    this.filesRepo.listFolder(newPath).subscribe();
  }

  private savePath(): void {
    const [, ...separatedFolders] = this.path.getSeparatedFolders();
    this.separatedFolders = separatedFolders;
  }
}

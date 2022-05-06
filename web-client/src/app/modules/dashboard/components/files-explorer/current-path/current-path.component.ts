import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PathService } from '@modules/dashboard/services/path.service';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-current-path',
  templateUrl: './current-path.component.html',
  styleUrls: ['./current-path.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentPathComponent {

  readonly separatedFolders = new BehaviorSubject<string[]>([]);

  constructor(private path: PathService,
              private filesRepo: FilesRepositoryService) {
    this.path.currentPath$.subscribe(
      () => this.savePath()
    );
  }

  onClick(pathDepth: number): void {
    const newPath = this.separatedFolders.value
      .slice(0, pathDepth + 1)
      .reduce((previousValue, currentValue) => previousValue + currentValue + '/', '/');

    this.filesRepo.listFolder(newPath).subscribe();
  }

  private savePath(): void {
    const [, ...separatedFolders] = this.path.getSeparatedFolders();
    this.separatedFolders.next(separatedFolders);
  }
}

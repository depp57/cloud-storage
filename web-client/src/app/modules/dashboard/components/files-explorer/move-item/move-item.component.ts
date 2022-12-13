import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Item, Folder } from '@modules/dashboard/models/item';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { PATH_SEPARATOR } from '@shared/constants';

@Component({
  selector: 'app-move-item',
  templateUrl: './move-item.component.html',
  styleUrls: ['./move-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveItemComponent implements OnInit, OnDestroy {

  @Input() item!: Item;
  @Output() moveFileEvent = new EventEmitter<Folder | null>();
  private _selectedFolder?: Folder = undefined;

  constructor(private filesRepo: FilesRepositoryService) {}

  ngOnDestroy(): void {
    MoveItemComponent.enableDashboardScroll();
  }

  ngOnInit(): void {
    MoveItemComponent.disableDashboardScroll();
  }

  onClose(): void {
    this.moveFileEvent.emit(null);
  }

  onMove(): void {
    if (this._selectedFolder) {
      this.filesRepo.move(this.item, this._selectedFolder + PATH_SEPARATOR + this.item.path).subscribe();
      this.onClose();
    }
  }

  onSelectFolder(folder: Folder): void {
    this._selectedFolder = folder;
  }

  private static enableDashboardScroll(): void {
    const container           = document.querySelector('mat-sidenav-content') as HTMLElement;
    container.style.overflowY = '';
  }

  private static disableDashboardScroll(): void {
    const container           = document.querySelector('mat-sidenav-content') as HTMLElement;
    container.style.overflowY = 'clip';
  }
}

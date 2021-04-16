import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Folder, Item } from '@modules/dashboard/models/items';
import { ItemLogic } from '@modules/dashboard/services/item-logic.service';

@Component({
  selector: 'app-move-item',
  templateUrl: './move-item.component.html',
  styleUrls: ['./move-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveItemComponent implements OnInit, OnDestroy {

  @Input() item!: Item;
  private _selectedFolder?: Folder = undefined;

  constructor(private itemLogic: ItemLogic) {}

  ngOnDestroy(): void {
    MoveItemComponent.enableDashboardScroll();
  }

  ngOnInit(): void {
    MoveItemComponent.disableDashboardScroll();
  }

  onClose(): void {
    this.itemLogic.dontMoveItem();
  }

  onMove(): void {
    if (this._selectedFolder) {
      this.itemLogic.moveItemWithoutDialog(this.item, this._selectedFolder.filePath + this.item.fullName);
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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { Item } from '@modules/dashboard/models/items';

@Component({
  selector: 'app-delete',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent extends DialogComponent<Item, boolean> {

  get title(): string {
    return this.inputData.isFile() ?
      `Supprimer le fichier ${this.inputData.fullName} ?` :
      `Supprimer le dossier ${this.inputData.name} ?`;
  }

  onClose(): void {
    this.submit$.next(false);
    this.closeDialog$.next();
  }

  onDelete(): void {
    this.submit$.next(true);
    this.closeDialog$.next();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { InputDeleteData } from '@modules/utils/dialog/model/dialog-data';

@Component({
  selector: 'app-delete',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent extends DialogComponent<InputDeleteData, boolean> {

  get title(): string {
    if (!this.inputData.extension) {
      return `Supprimer le dossier ${this.inputData.name} ?`;
    }

    const extension = this.inputData.extension !== '.' ? this.inputData.extension : '';
    return `Supprimer le fichier ${this.inputData.name}${extension} ?`;
  }

  onClose(): void {
    this.submit.next(false);
    this.closeDialog.next();
  }

  onDelete(): void {
    this.submit.next(true);
    this.closeDialog.next();
  }
}

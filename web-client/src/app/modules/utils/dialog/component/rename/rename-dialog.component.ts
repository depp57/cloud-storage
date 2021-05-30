import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OutputRenameData } from '@modules/utils/dialog/model/dialog-data';
import { Item } from '@modules/dashboard/models/items';

@Component({
  selector: 'app-rename',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameDialogComponent extends DialogComponent<Item, OutputRenameData> implements OnInit {

  renameForm!: FormGroup;

  get name(): string {
    return this.renameForm.get('name')?.value;
  }

  get extension(): string {
    const extension = this.renameForm.get('extension')?.value;
    return extension !== '' ? `.${extension}` : '';
  }

  ngOnInit(): void {
    this.initForm();
  }

  onClose(): void {
    this.submit$.next(null);
    this.closeDialog$.next();
  }

  onSubmit(): void {
    this.submit$.next(
      this.inputData.rename(this.name, this.extension).fullPath
    );
    this.closeDialog$.next();
  }

  private initForm(): void {
    this.renameForm = new FormGroup({
      name: new FormControl(this.inputData.name, Validators.required),
      extension: new FormControl(this.inputData.extension)
    });
  }
}

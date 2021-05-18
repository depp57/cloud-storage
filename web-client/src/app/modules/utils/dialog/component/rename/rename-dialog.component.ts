import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRenameData, OutputRenameData } from '@modules/utils/dialog/model/dialog-data';

@Component({
  selector: 'app-rename',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent extends DialogComponent<InputRenameData, OutputRenameData> implements OnInit {

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
    this.submit.next(null);
    this.closeDialog.next();
  }

  onSubmit(): void {
    this.submit.next({
      name: this.name,
      extension: this.extension
    });
    this.closeDialog.next();
  }

  private initForm(): void {
    this.renameForm = new FormGroup({
      name: new FormControl(this.inputData.name, Validators.required),
      extension: new FormControl(this.inputData.extension?.substr(1))
    });
  }
}

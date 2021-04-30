import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RenameData } from '@modules/utils/dialog/model/dialog-data';

@Component({
  selector: 'app-rename',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent extends DialogComponent<RenameData> implements OnInit {

  renameForm!: FormGroup;

  get name(): string {
    return this.renameForm.get('name')?.value;
  }

  get extension(): string {
    return this.renameForm.get('extension')?.value;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.submit.emit({
        name: this.name,
        extension: '.' + this.extension
    });
    this.delete.emit();
  }

  onClose(): void {
    this.delete.emit();
  }

  private initForm(): void {
    this.renameForm = new FormGroup({
      name: new FormControl(this.inputData.name, Validators.required),
      extension: new FormControl(this.inputData.extension?.substr(1))
    });
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DialogComponent } from '@modules/shared/dialog/component/dialog-component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OutputString } from '@modules/shared/dialog/model/dialog-data';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFolderDialogComponent extends DialogComponent<null, OutputString> implements OnInit {

  renameForm!: FormGroup;

  constructor() {
    super();
  }

  get name(): string {
    return this.renameForm.get('name')?.value;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onClose(): void {
    this.submit$.next(null);
    this.closeDialog$.next();
  }

  onSubmit(): void {
    this.submit$.next(this.name);
    this.closeDialog$.next();
  }

  private initForm(): void {
    this.renameForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }
}

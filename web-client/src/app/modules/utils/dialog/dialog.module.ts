import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenameDialogComponent } from '@modules/utils/dialog/component/rename/rename-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DeleteDialogComponent } from 'src/app/modules/utils/dialog/component/delete/delete-dialog.component';
import { BaseDialogComponent } from './component/base-dialog/base-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    RenameDialogComponent,
    DeleteDialogComponent,
    BaseDialogComponent
  ]
})
export class DialogModule {}

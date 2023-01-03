import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenameDialogComponent } from '@modules/shared/dialog/component/rename/rename-dialog.component';
import { DeleteDialogComponent } from '@modules/shared/dialog/component/delete/delete-dialog.component';
import { CreateFolderDialogComponent } from '@modules/shared/dialog/component/create-folder/create-folder-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialogComponent } from '@modules/shared/dialog/component/base-dialog/base-dialog.component';
import { SharedModule } from '@shared/shared.module';

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
    CreateFolderDialogComponent,
    BaseDialogComponent
  ]
})
export class DialogModule {}

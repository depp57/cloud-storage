import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenameDialogComponent } from '@modules/utils/dialog/component/rename/rename-dialog.component';
import { DialogService } from '@modules/utils/dialog/service/dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
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
  providers: [
    DialogService
  ],
  declarations: [
    RenameDialogComponent
  ]
})
export class DialogModule {}

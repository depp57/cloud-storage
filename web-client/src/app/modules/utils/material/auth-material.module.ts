import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

const materialComponents = [
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatProgressBarModule,
  MatIconModule,
  MatSnackBarModule,
  MatButtonModule
];

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})
export class AuthMaterialModule {}

import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

const materialModules = [
  MatInputModule,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatButtonModule,
  MatMenuModule
];

@NgModule({
  imports: [materialModules],
  exports: [materialModules]
})
export class DashboardMaterialModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { DashboardComponent } from './components/dashboard.component';
import { FileComponent } from './components/files-explorer/file/file.component';
import { FilesExplorerComponent } from './components/files-explorer/files-explorer.component';
import { FolderComponent } from './components/files-explorer/folder/folder.component';
import { CurrentPathComponent } from './components/files-explorer/current-path/current-path.component';
import { MoveItemComponent } from './components/files-explorer/move-item/move-item.component';
import { HeaderComponent } from './components/header/header.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuModule } from '@modules/shared/context-menu/context-menu.module';
import { DialogModule } from '@modules/shared/dialog/dialog.module';
import { FolderTreeModule } from '@modules/shared/folder-tree/folder-tree.module';
import { UploaderComponent } from './components/files-explorer/uploader/uploader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const materialModules = [
  MatInputModule,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatButtonModule,
  MatMenuModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FilesExplorerComponent,
    RecentFilesComponent,
    SidenavComponent,
    FileComponent,
    FolderComponent,
    CurrentPathComponent,
    MoveItemComponent,
    FilterPipe,
    UploaderComponent
  ],
  imports: [
    CommonModule,
    ContextMenuModule,
    DialogModule,
    FolderTreeModule,
    DashboardRoutingModule,
    FormsModule,
    materialModules,
  ]
})
export class DashboardModule {}

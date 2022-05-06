import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from '@modules/utils/context-menu/context-menu.module';
import { DialogModule } from '@modules/utils/dialog/dialog.module';
import { DashboardMaterialModule } from '@modules/utils/material/dashboard-material.module';
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
import { FolderTreeModule } from '@modules/utils/folder-tree/folder-tree.module';

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
    FilterPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardMaterialModule,
    ContextMenuModule,
    DialogModule,
    FormsModule,
    FolderTreeModule
  ]
})
export class DashboardModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FilesExplorerComponent } from './components/files-explorer/files-explorer.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMaterialModule } from 'src/app/modules/utils/material/dashboard-material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FileComponent } from './components/files-explorer/file/file.component';
import { FolderComponent } from './components/files-explorer/folder/folder.component';
import { ContextMenuModule } from 'src/app/modules/utils/context-menu/context-menu.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FilesExplorerComponent,
    RecentFilesComponent,
    SidenavComponent,
    FileComponent,
    FolderComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardMaterialModule,
    ContextMenuModule,
    SharedModule
  ]
})
export class DashboardModule {
}

import { NgModule} from '@angular/core';
import { CommonModule} from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FilesExplorerComponent } from './components/files-explorer/files-explorer.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/modules/material/material.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FilesExplorerComponent,
    RecentFilesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule
  ]
})
export class DashboardModule {
}

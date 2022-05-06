import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { FilesExplorerComponent } from './components/files-explorer/files-explorer.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children:
      [
        {path: '', pathMatch: 'full', component: FilesExplorerComponent},
        {path: 'recents', data: {title: 'Récents'}, component: RecentFilesComponent},
        {path: '**', data: {title: 'Page non trouvée'}, component: NotFoundComponent} // redirect all 404 pages
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}

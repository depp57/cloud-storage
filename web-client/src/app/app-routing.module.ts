import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/auth.guard';
import { PageNotFoundGuard } from '@shared/services/page-not-found.guard';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', data: {title: 'Connexion'},
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'fichiers', data: {title: 'Stockage'}, canActivate: [AuthGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**', data: {title: 'Page non trouvée'}, component: LoginComponent, canActivate: [PageNotFoundGuard]
  } // redirect all 404 pages
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

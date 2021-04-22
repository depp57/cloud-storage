import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from 'src/app/modules/auth/components/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/modules/auth/components/sign-up/sign-up.component';
import { AuthComponent } from 'src/app/modules/auth/components/auth.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children:
      [
        {path: '', pathMatch: 'full', component: SignInComponent},
        {path: 'inscription', data: {title: 'Inscription'}, component: SignUpComponent}
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

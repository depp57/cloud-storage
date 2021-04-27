import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from 'src/app/modules/auth/components/sign-in/sign-in.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthComponent } from 'src/app/modules/auth/components/auth.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { AuthMaterialModule } from 'src/app/modules/utils/material/auth-material.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    AuthComponent,
    AuthFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    AuthMaterialModule
  ]
})
export class AuthModule {}

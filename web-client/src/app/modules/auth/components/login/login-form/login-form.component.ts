import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.minLength(4)],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username(): AbstractControl | null { return this.loginForm.get('username'); }

  get password(): AbstractControl | null { return this.loginForm.get('password'); }


  get usernameErrorMessage(): string {
    if (this.username?.hasError('required')) {
      return 'Vous devez entrer un nom d\'utilisateur';
    }

    return this.username?.hasError('minLength') ? 'Le nom d\'utilisateur doit avoir au moins 4 caractères' : '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Vous devez entrer un mot de passe';
    }

    return this.password?.hasError('minLength') ? 'Le mot de passe doit avoir au moins 6 caractères' : '';
  }

  onSignIn(): void {
    this.authService.signIn({username: this.username?.value, password: this.password?.value})
      .subscribe(
        res => console.log(`works!${res}`),
        err => console.log(`err${err}`)
      );
  }
}

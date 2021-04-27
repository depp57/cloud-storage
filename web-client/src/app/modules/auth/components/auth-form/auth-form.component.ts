import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiAuthParam } from 'src/app/modules/auth/models/api-auth';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  @Input() isSignIn!: boolean;
  @Output() submitForm = new EventEmitter<ApiAuthParam>();
  loginForm!: FormGroup;
  hidePassword = true;

  get username(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get usernameErrorMessage(): string {
    if (this.username?.hasError('required')) {
      return 'Vous devez entrer un nom d\'utilisateur';
    }

    return this.username?.hasError('minlength') ? 'Le nom d\'utilisateur doit avoir au moins 4 caractères' : '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Vous devez entrer un mot de passe';
    }

    return this.password?.hasError('minlength') ? 'Le mot de passe doit avoir au moins 6 caractères' : '';
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.submitForm.emit({username: this.username?.value, password: this.password?.value});
    this.password?.reset();
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
}

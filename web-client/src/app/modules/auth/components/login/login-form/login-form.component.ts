import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() logEvent = new EventEmitter<void>();
  loginForm!: FormGroup;
  hidePassword = true;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
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
    this.logEvent.emit();
  }
}

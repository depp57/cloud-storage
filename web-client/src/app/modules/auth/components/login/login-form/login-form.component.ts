import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>();
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private router: Router,
              private authService: AuthService,
              private snackBar: MatSnackBar) { }

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
    this.loading.emit(true);

    this.authService.signIn({username: this.username?.value, password: this.password?.value})
      .subscribe(
        _ => this.navigateToDashboard(),
        err => this.showLoginError(err.status)
      )
      .add(() => this.loading.emit(false));
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/fichiers']);
  }

  private showLoginError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(message, 'Fermer', {duration: 3000});
  }
}

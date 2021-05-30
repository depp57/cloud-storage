import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnInit {

  loading      = false;
  hidePassword = true;
  signInForm!: FormGroup;

  constructor(private router: Router,
              private auth: AuthService,
              private snackBar: MatSnackBar) {}

  get username(): AbstractControl | null {
    return this.signInForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.signInForm.get('password');
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

  onSignIn(): void {
    const username = this.username?.value;
    const password = this.password?.value;

    this.auth.signIn({username, password})
      .subscribe(
        () => this.navigateToDashboard(),
        (err) => {
          this.password?.reset();
          this.showSignInError(err.status);
        }
      );
  }

  private initForm(): void {
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  private showSignInError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur de connexion : ${message}`, 'Fermer', {duration: 3000});
  }

  private navigateToDashboard(): void {
    this.router.navigateByUrl('/fichiers');
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {

  loading             = false;
  hidePassword        = true;
  hideConfirmPassword = true;
  signUpForm!: FormGroup;

  constructor(private router: Router,
              private auth: AuthService,
              private snackBar: MatSnackBar) {}

  get username(): AbstractControl | null {
    return this.signUpForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.signUpForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.signUpForm.get('confirmPassword');
  }

  get usernameError(): string {
    if (this.username?.hasError('required')) {
      return 'Vous devez entrer un nom d\'utilisateur';
    }

    return this.username?.hasError('minlength') ? 'Le nom d\'utilisateur doit avoir au moins 4 caractères' : '';
  }

  get passwordError(): string {
    if (this.password?.hasError('required')) {
      return 'Vous devez entrer un mot de passe';
    }

    return this.password?.hasError('minlength') ? 'Le mot de passe doit avoir au moins 6 caractères' : '';
  }

  get confirmPasswordError(): string {
    return 'Les mots de passe ne correspondent pas';
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSignUp(): void {
    const username = this.username?.value;
    const password = this.password?.value;

    this.auth.signUp({username, password})
      .subscribe(
        () => this.navigateToDashboard(),
        (err) => {
          this.resetForm();
          this.showSignUpError(err.status);
        }
      );
  }

  private resetForm(): void {
    this.password?.reset();
    this.confirmPassword?.reset();
  }

  private initForm(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
    }, SignUpComponent.passwordsMatchValidator);
  }

  private navigateToDashboard(): void {
    this.router.navigateByUrl('/fichiers');
  }

  private showSignUpError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur d'inscription : ${message}`, 'Fermer', {duration: 3000});
  }

  private static passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password        = form?.get('password');
    const confirmPassword = form?.get('confirmPassword');

    const match = password?.value === confirmPassword?.value;

    if (match) {
      confirmPassword?.setErrors(null);
      return null;
    }
    else {
      const error = {mismatch: true};
      confirmPassword?.setErrors(error);
      return error;
    }
  }
}

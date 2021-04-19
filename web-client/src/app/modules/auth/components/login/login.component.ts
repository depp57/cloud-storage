import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  private redirectCause: string | undefined;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private auth: AuthService) {
    this.redirectCause = router.getCurrentNavigation()?.extras?.state?.redirect;
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.navigateToDashboard();
    }
    else {
      this.showRedirectCause();
    }
  }

  private showRedirectCause(): void {
    if (this.redirectCause !== undefined) {
      this.snackBar.open(this.redirectCause, 'Fermer', {duration: 3000});

      this.redirectCause = undefined;
    }
  }

  onSignIn(username: string, password: AbstractControl | null): void {
    this.loading = true;

    this.auth.signIn({username, password: password?.value})
      .subscribe(
        _ => this.navigateToDashboard(),
        err => {
          password?.reset();
          this.showLoginError(err.status);
        }
      )
      .add(() => this.loading = false);
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/fichiers']);
  }

  private showLoginError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(message, 'Fermer', {duration: 3000});
  }
}

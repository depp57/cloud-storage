import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  @Output() signInEvent = new EventEmitter<void>();
  loading = false;

  constructor(private router: Router,
              private auth: AuthService,
              private snackBar: MatSnackBar) { }

  onSignIn(username: string, password: string): void {
    this.auth.signIn({username, password})
      .subscribe(
        _ => this.navigateToDashboard(),
        err => this.showSignInError(err.status)
      );
  }

  private showSignInError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur de connexion : ${message}`, 'Fermer', {duration: 3000});
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/fichiers']);
  }
}

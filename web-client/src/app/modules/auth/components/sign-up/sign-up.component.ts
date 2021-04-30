import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  @Output() signInEvent = new EventEmitter<void>();
  hidePassword = true;

  constructor(private snackBar: MatSnackBar,
              private auth: AuthService,
              private router: Router) { }

  onSignUp(username: string, password: string): void {
    this.auth.signUp({username, password}).subscribe(
      _ => this.navigateToDashboard(),
      err => this.showSignUpError(err.status)
    );
  }

  private showSignUpError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur d'inscription : ${message}`, 'Fermer', {duration: 3000});
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/fichiers']);
  }
}

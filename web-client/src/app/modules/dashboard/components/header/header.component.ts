import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { HTTP_ERROR_CODES, RedirectReasons } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sideBarToggle = new EventEmitter<void>();
  @Output() fileSearch = new EventEmitter<string>();

  constructor(private router: Router,
              private auth: AuthService,
              private snackBar: MatSnackBar) { }

  toggleSideBar(): void {
    this.sideBarToggle.emit();
  }

  signOut(): void {
    this.auth.signOut()
      .subscribe(
        _ => this.navigateToLogin(),
        err => this.showLogoutError(err.status)
      );
  }

  private navigateToLogin(): void {
    this.router.navigate([''], {state: {redirect: RedirectReasons.SIGNED_OUT}});
  }

  private showLogoutError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur de déconnexion : ${message}`, 'Fermer', {duration: 3000});
  }

  onSearch(event: Event): void {
    this.fileSearch.emit((event.target as HTMLInputElement).value);
  }
}

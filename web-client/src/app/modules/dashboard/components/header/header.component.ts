import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { HTTP_ERROR_CODES, RedirectReasons } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CssThemeService } from '@shared/services/css-theme.service';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @Output() sideBarToggle = new EventEmitter<void>();

  constructor(private router: Router,
              private auth: AuthService,
              private snackBar: MatSnackBar,
              private cssTheme: CssThemeService,
              private filesRepo: FilesRepositoryService) {}

  get isLightMode(): boolean {
    return this.cssTheme.theme === 'light-theme';
  }

  toggleSideBar(): void {
    this.sideBarToggle.emit();
  }

  signOut(): void {
    this.auth.signOut().subscribe(
      () => this.navigateToLogin(),
      err => this.showLogoutError(err.status)
    );
  }

  onSearch(event: Event): void {
    this.filesRepo.searchByText((event.target as HTMLInputElement).value);
  }

  onChangeTheme(theme: string): void {
    this.cssTheme.setTheme(theme);
  }

  private navigateToLogin(): void {
    this.router.navigateByUrl('/', {state: {redirect: RedirectReasons.SIGNED_OUT}});
  }

  private showLogoutError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur de déconnexion : ${message}`, 'Fermer', {duration: 3000});
  }
}

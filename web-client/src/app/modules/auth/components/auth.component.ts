import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { LoaderService } from '@shared/services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

  private _redirectCause: string | undefined;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private auth: AuthService,
              private loader: LoaderService) {
    this._redirectCause = router.getCurrentNavigation()?.extras?.state?.redirect;
  }

  get isLoading$(): Observable<boolean> {
    return this.loader.isLoading$;
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.navigateToDashboard();
    }
    else {
      this.showRedirectCause();
    }
  }

  private showRedirectCause(): void {
    if (this._redirectCause !== undefined) {
      this.snackBar.open(this._redirectCause, 'Fermer', {duration: 3000});

      this._redirectCause = undefined;
    }
  }

  private navigateToDashboard(): void {
    this.router.navigateByUrl('/fichiers');
  }
}

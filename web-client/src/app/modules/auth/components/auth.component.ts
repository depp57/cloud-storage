import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { LoaderService } from '@shared/services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

  private redirectCause: string | undefined;


  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private auth: AuthService,
              private loader: LoaderService) {
    this.redirectCause = router.getCurrentNavigation()?.extras?.state?.redirect;
  }

  get isLoading(): BehaviorSubject<boolean> {
    return this.loader.isLoading;
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
    if (this.redirectCause !== undefined) {
      this.snackBar.open(this.redirectCause, 'Fermer', {duration: 3000});

      this.redirectCause = undefined;
    }
  }

  private navigateToDashboard(): void {
    this.router.navigate(['/fichiers']);
  }
}

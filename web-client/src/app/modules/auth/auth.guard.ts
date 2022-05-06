import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RedirectReasons } from '@shared/constants';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService) {}

  canActivate(): boolean {
    const isAuth = this.auth.isAuthenticated;

    if (!isAuth) {
      this.router.navigateByUrl('/', {state: {redirect: RedirectReasons.UNAUTHENTICATED}});
    }

    return isAuth;
  }
}

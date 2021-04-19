import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RedirectReasons } from '@shared/constants';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuth = this.authService.isAuthenticated();

    if (!isAuth) {
      this.router.navigate([''], {state: {redirect: RedirectReasons.UNAUTHENTICATED}}); // TODO PROMISE
    }

    return isAuth;
  }
}

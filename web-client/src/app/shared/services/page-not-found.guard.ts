import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RedirectReasons } from '@shared/constants';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class PageNotFoundGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['fichiers'], {state: {redirect: RedirectReasons.PAGE_NOT_FOUND}});
    }
    else {
      this.router.navigate([''], {state: {redirect: RedirectReasons.PAGE_NOT_FOUND}});
    }
    return false;
  }
}

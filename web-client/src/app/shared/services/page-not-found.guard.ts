import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RedirectReasons } from '@shared/models/redirect-reasons';

@Injectable({providedIn: 'root'})
export class PageNotFoundGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.router.navigate([''], {state: {redirect: RedirectReasons.PAGE_NOT_FOUND}});
    return false;
  }
}

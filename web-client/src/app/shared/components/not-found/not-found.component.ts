import { Component } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  readonly isAuth: boolean;

  constructor(private auth: AuthService) {
    this.isAuth = this.auth.isAuthenticated;
  }
}

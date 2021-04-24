import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isMobile!: boolean;

  constructor(private auth: AuthService,
              private loader: LoaderService) {}

  get isLoading(): BehaviorSubject<boolean> {
    return this.loader.isLoading;
  }

  get username(): string {
    const username = this.auth.userCredentials?.username;
    return username ? username : '';
  }

  ngOnInit(): void {
    // not responsive if the user resize the window, but avoid listening to
    // window's resizing event => more performance
    this.isMobile = window.innerWidth < 599;
  }
}

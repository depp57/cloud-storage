import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';
import { Observable } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterContentInit {

  isMobile!: boolean;
  readonly username: string;

  constructor(private auth: AuthService,
              private loader: LoaderService) {
    this.username = this.auth.userCredentials?.username ?? '';
  }

  get isLoading$(): Observable<boolean> {
    return this.loader.isLoading$;
  }

  ngAfterContentInit(): void {
    // not responsive if the user resize the window, but avoid listening to
    // window's resizing event => more performance
    this.isMobile = window.innerWidth < 599;
  }
}

import { AfterContentInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { ContextMenuService } from '@modules/utils/context-menu/service/context-menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterContentInit, AfterViewInit {

  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  isMobile!: boolean;

  constructor(private auth: AuthService,
              private loader: LoaderService,
              private contextMenu: ContextMenuService) {}

  get isLoading(): BehaviorSubject<boolean> {
    return this.loader.isLoading;
  }

  get username(): string {
    const username = this.auth.userCredentials?.username;
    return username ? username : '';
  }

  ngAfterContentInit(): void {
    // not responsive if the user resize the window, but avoid listening to
    // window's resizing event => more performance
    this.isMobile = window.innerWidth < 599;
  }

  ngAfterViewInit(): void {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(
      () => this.contextMenu.deleteMenu()
    );
  }
}

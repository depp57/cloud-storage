import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { CssThemeService } from '@shared/services/css-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly title = 'Cloud-Storage';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private cssTheme: CssThemeService) {}

  ngOnInit(): void {
    this.setDynamicPageTitle();

    // Unnecessary unsubscription because it is needed as long as the app is living
    this.cssTheme.getTheme().subscribe(theme => AppComponent.setTheme(theme));
  }

  private setDynamicPageTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const lastChild = AppComponent.getChild(this.activatedRoute);
      lastChild.data.subscribe(data => {
        this.titleService.setTitle(`${data.title} - ${this.title}`);
      });
    });
  }

  private static setTheme(theme: string): void {
    const appRoot = document.getElementById('main-container');
    if (appRoot) {
      appRoot.className = theme;
    }
  }

  private static getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }
    return activatedRoute;
  }
}

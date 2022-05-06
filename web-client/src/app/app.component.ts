import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { CssThemeService } from '@shared/services/css-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  private readonly _title = 'Cloud-Storage';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private cssTheme: CssThemeService) {}

  ngOnInit(): void {
    this.setDynamicPageTitle();
  }

  get theme(): string {
    return this.cssTheme.theme;
  }

  private setDynamicPageTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const lastChild = AppComponent.getChild(this.activatedRoute);
      lastChild.data.subscribe(data => {
        this.titleService.setTitle(`${data.title} - ${this._title}`);
      });
    });
  }

  private static getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }
    return activatedRoute;
  }
}

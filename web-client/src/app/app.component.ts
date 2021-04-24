import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly title = 'Cloud-Storage';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) { }

  ngOnInit(): void {
    this.setDynamicPageTitle();
  }

  private setDynamicPageTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const lastChild = this.getChild(this.activatedRoute);
      lastChild.data.subscribe(data => {
        this.titleService.setTitle(`${data.title} - ${this.title}`);
      });
    });
  }

  getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }
    return activatedRoute;
  }
}

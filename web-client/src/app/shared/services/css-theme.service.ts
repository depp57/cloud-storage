import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class CssThemeService {

  private readonly _theme: BehaviorSubject<string> = new BehaviorSubject<string>(CssThemeService.defaultTheme);

  constructor(private overlayContainer: OverlayContainer) {}

  getTheme(): BehaviorSubject<string> {
    return this._theme;
  }

  setTheme(theme: string): void {
    this._theme.next(theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(appRoot: HTMLElement, theme: string): void {
    appRoot.className = theme;

    // explanation https://material.angular.io/guide/theming#multiple-themes-and-overlay-based-components
    const overlayContainerCss = this.overlayContainer.getContainerElement().classList;
    CssThemeService.removeCssTheme(overlayContainerCss);

    overlayContainerCss.add(theme);
  }

  private static get defaultTheme(): string {
    return localStorage.getItem('theme') || 'light-theme';
  }

  private static removeCssTheme(element: DOMTokenList): void {
    element.forEach((value) => {
      if (value.endsWith('-theme')) {
        element.remove(value);
        return;
      }
    });
  }
}

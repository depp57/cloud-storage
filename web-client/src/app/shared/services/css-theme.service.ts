import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CssThemeService {

  private _theme = CssThemeService.defaultTheme;

  get theme(): string {
    return this._theme;
  }

  setTheme(theme: string): void {
    const appRoot = document.getElementById('main-container');

    if (appRoot) {
      this._theme = theme;
      localStorage.setItem('theme', theme);
    }
  }

  private static get defaultTheme(): string {
    return localStorage.getItem('theme') || 'light-theme';
  }
}

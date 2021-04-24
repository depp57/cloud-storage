import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CssThemeService {

  private readonly _theme: BehaviorSubject<string> = new BehaviorSubject<string>(CssThemeService.defaultTheme);

  getTheme(): BehaviorSubject<string> {
    return this._theme;
  }

  setTheme(theme: string): void {
    this._theme.next(theme);
    localStorage.setItem('theme', theme);
  }

  private static get defaultTheme(): string {
    return localStorage.getItem('theme') || 'light-theme';
  }
}

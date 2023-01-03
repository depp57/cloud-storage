import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  private readonly _currentPath$ = new BehaviorSubject<string>('/');
  private readonly _separatedFolder$ = new BehaviorSubject<string[]>(['/']);

  get currentPath$(): BehaviorSubject<string> {
    return this._currentPath$;
  }

  get separatedFolder$(): BehaviorSubject<string[]> {
    return this._separatedFolder$;
  }

  updatePath(filePath: string): void {
    this._currentPath$.next(filePath);
    this._separatedFolder$.next(this.getSeparatedFolders());
  }

 private getSeparatedFolders(): string[] {
    if (this._currentPath$.value === '/') {
      return ['/'];
    }

    const separatedFolders = this._currentPath$.value.split('/');
    separatedFolders[0] = '/';

    return separatedFolders;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  private readonly _currentPath$ = new BehaviorSubject<string>('/');

  get currentPath$(): BehaviorSubject<string> {
    return this._currentPath$;
  }

  updatePath(filePath: string): void {
    this._currentPath$.next(PathService.ensureLastDash(filePath));
  }

  getSeparatedFolders(): string[] {
    const separatedFolders = this._currentPath$.value.split('/');

    // remove last extra folder, e.g '/test/'.split('/') results in ['', 'test', '']
    separatedFolders.pop();

    return separatedFolders;
  }

  private static ensureLastDash(path: string): string {
    return path.endsWith('/') ? path : path + '/';
  }
}

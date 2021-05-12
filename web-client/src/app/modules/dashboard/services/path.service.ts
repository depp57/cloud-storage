import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  private _currentPath = new BehaviorSubject<string>('/');

  get currentPath(): BehaviorSubject<string> {
    return this._currentPath;
  }

  updatePath(path: string): void {
    let newPath: string;

    if (PathService.isAbsolute(path)) {
      newPath = path;
    }
    else {
      newPath = this._currentPath.value + path;
    }

    newPath = PathService.ensureLastDash(newPath);

    this._currentPath.next(newPath);
  }

  getSeparatedFolders(): string[] {
    const separatedFolders = this._currentPath.value.split('/');

    // remove last extra folder, e.g '/test/'.split('/') results in ['', 'test', '']
    separatedFolders.pop();

    return separatedFolders;
  }

  private static ensureLastDash(path: string): string {
    return path.endsWith('/') ? path : path + '/';
  }

  private static isAbsolute(path: string): boolean {
    return path.charAt(0) === '/';
  }
}

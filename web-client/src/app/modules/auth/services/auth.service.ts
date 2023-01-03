import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_LIFETIME } from '@shared/constants';
import { Observable } from 'rxjs';
import { ApiAuthParam, ApiAuthResponse, UserCredentials } from '@modules/auth/models/api-auth';
import { deleteCookie, getCookie, setCookie } from '@modules/auth/models/cookies-utils';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userCredentials: UserCredentials | undefined;

  constructor(private http: HttpClient) {}

  get isAuthenticated(): boolean {
    if (this._userCredentials) {
      return true;
    }
    else {
      this._userCredentials = this.userCredentials;
      return this._userCredentials !== undefined;
    }
  }

  get userCredentials(): UserCredentials | undefined {
    if (this._userCredentials) {
      return this._userCredentials;
    }
    else {
      const cookie = getCookie(AUTH_COOKIE_NAME);
      if (cookie !== undefined) {
        this._userCredentials = UserCredentials.fromJson(cookie);
      }
      return this._userCredentials;
    }
  }

  signIn(user: ApiAuthParam): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>('auth', user).pipe(
      tap(response => this.saveUserCredentials(user.username, response.token))
    );
  }

  signUp(user: ApiAuthParam): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>('subscribe', user).pipe(
      tap(response => {
        this.saveUserCredentials(user.username, response.token);
      })
    );
  }

  signOut(): Observable<ApiAuthResponse> {
    return this.http.get<ApiAuthResponse>('auth/disconnect').pipe(
      tap(() => this.deleteUserCredentials())
    );
  }

  private saveUserCredentials(username: string, token: string): void {
    const userCredentials = new UserCredentials(username, token);
    setCookie(AUTH_COOKIE_NAME, userCredentials.asJson, AUTH_COOKIE_LIFETIME);
    this._userCredentials = userCredentials;
  }

  private deleteUserCredentials(): void {
    deleteCookie(AUTH_COOKIE_NAME);
    this._userCredentials = undefined;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, AUTH_COOKIE_NAME, USER_TOKEN_COOKIE_LIFETIME } from '@shared/constants';
import { Observable } from 'rxjs';
import { ApiAuthParam, ApiAuthResponse, UserCredentials } from 'src/app/modules/auth/models/api-auth';
import { deleteCookie, getCookie, setCookie } from '@shared/models/cookies-utils';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userCredentials: UserCredentials | undefined;

  constructor(private http: HttpClient) {}

  signIn(user: ApiAuthParam): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(API_ENDPOINT + 'auth/', user).pipe(
      tap(response => {
        const userCredentials = new UserCredentials(user.username, response.token);
        setCookie(AUTH_COOKIE_NAME, userCredentials.asJson, USER_TOKEN_COOKIE_LIFETIME);
      })
    );
  }

  signOut(): Observable<ApiAuthResponse> {
    // TODO SIGN OUT WITH REST API + DELETE ONLY IN SUCCESS OBSERVABLE
    deleteCookie(AUTH_COOKIE_NAME);
    this._userCredentials = undefined;
    return new Observable<ApiAuthResponse>((subscriber => subscriber.next({token: 'foo', error: 'foo'})));
  }

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
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, AUTH_COOKIE_NAME, USER_TOKEN_COOKIE_LIFETIME } from '@shared/constants';
import { Observable } from 'rxjs';
import { ApiAuthParam, ApiAuthResponse } from 'src/app/modules/auth/models/api-auth';
import { getCookie, setCookie } from '@shared/models/cookies-utils';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authToken: string | undefined;

  constructor(private http: HttpClient) {}

  signIn(user: ApiAuthParam): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(API_ENDPOINT + 'auth/', user).pipe(
      tap(response => setCookie(AUTH_COOKIE_NAME, response.token, USER_TOKEN_COOKIE_LIFETIME))
    );
  }

  get isAuthenticated(): boolean {
    if (this._authToken) {
      return true;
    }
    else {
      this._authToken = getCookie(AUTH_COOKIE_NAME);
      return this._authToken !== undefined;
    }
  }

  get authToken(): string | undefined {
    if (this._authToken) {
      return this._authToken;
    }
    else {
      this._authToken = getCookie(AUTH_COOKIE_NAME);
      return this._authToken;
    }
  }
}
